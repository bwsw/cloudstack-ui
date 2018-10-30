import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ErrorStateMatcher } from '@angular/material';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import { IPVersion, NetworkRuleType } from '../../sg.model';
import { NetworkProtocol } from '../../network-rule.model';
import {
  cidrValidator,
  endPortValidator,
  icmpCodeValidator,
  icmpTypeValidator,
  startPortValidator,
} from '../../shared/validators';
import {
  getICMPCodeTranslationToken,
  getICMPTypeTranslationToken,
  getICMPV6CodeTranslationToken,
  getICMPV6TypeTranslationToken,
  IcmpType,
  icmpV4Types,
  icmpV6Types,
} from '../../../shared/icmp/icmp-types';
import { FirewallRule } from '../../shared/models';
import { CidrUtils } from '../../../shared/utils/cidr-utils';

export class PortsErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl, form: FormGroupDirective | NgForm): boolean {
    return control.invalid && control.dirty;
  }
}

@Component({
  selector: 'cs-sg-rule-addition-form',
  templateUrl: './sg-rule-addition-form.component.html',
  styleUrls: ['./sg-rule-addition-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SGRuleAdditionFormComponent implements OnDestroy {
  // Workaround for resetting form state. https://github.com/angular/material2/issues/4190
  // We need manually reset FormGroupDirective via resetForm() method otherwise,
  // the form will be invalid and errors are shown
  @ViewChild('mainForm')
  mainForm;
  @Input()
  isAdding = false;
  @Output()
  addRule = new EventEmitter<FirewallRule>();

  public isIcmpProtocol = false;
  public filteredIcmpTypes: IcmpType[];
  public filteredIcmpCodes: number[];
  public portMatcher = new PortsErrorStateMatcher();

  public readonly maxPortNumber = 65535;
  public readonly minPortNumber = 0;

  public types = [
    { value: NetworkRuleType.Ingress, text: 'SECURITY_GROUP_PAGE.RULES.INGRESS' },
    { value: NetworkRuleType.Egress, text: 'SECURITY_GROUP_PAGE.RULES.EGRESS' },
  ];

  public protocols = [
    { value: NetworkProtocol.TCP, text: 'SECURITY_GROUP_PAGE.RULES.TCP' },
    { value: NetworkProtocol.UDP, text: 'SECURITY_GROUP_PAGE.RULES.UDP' },
    { value: NetworkProtocol.ICMP, text: 'SECURITY_GROUP_PAGE.RULES.ICMP' },
  ];

  public ruleForm: FormGroup;
  private portsForm: FormGroup;
  private icmpForm: FormGroup;

  private protocolChanges: Subscription;
  private cidrChanges: Subscription;
  private icmpTypeChanges: Subscription;
  private icmpCodeChanges: Subscription;
  private startPortChanges: Subscription;
  private endPortChanges: Subscription;

  constructor(private fb: FormBuilder, private translateService: TranslateService) {
    this.createForm();
    this.onProtocolChange();
    this.onCidrChange();
    this.onIcmpTypeChange();
    this.onIcmpCodeChange();
    this.onPortsChanges();
  }

  public ngOnDestroy() {
    this.protocolChanges.unsubscribe();
    this.cidrChanges.unsubscribe();
    this.icmpTypeChanges.unsubscribe();
    this.icmpCodeChanges.unsubscribe();
    this.startPortChanges.unsubscribe();
    this.endPortChanges.unsubscribe();
  }

  public createForm() {
    this.portsForm = this.fb.group({
      startPort: [null, [Validators.required]],
      endPort: [null, [Validators.required]],
    });

    this.icmpForm = this.fb.group({
      icmpType: [{ value: null, disabled: true }, [Validators.required]],
      icmpCode: [{ value: null, disabled: true }, [Validators.required]],
    });

    this.ruleForm = this.fb.group({
      type: [this.types[0].value, Validators.required],
      protocol: [this.protocols[0].value, Validators.required],
      cidr: ['', [Validators.required, cidrValidator()]],
      params: this.portsForm, // Depends on initial value of protocol
    });

    // Some validators required form controls and we can set them after they were created
    this.setPortFormValidators();
    this.setIcmpFormValidators();
  }

  public onSubmit() {
    const rule = this.getFormData();
    this.addRule.emit(rule);

    this.resetForm();
  }

  public getStartPortErrorMessage() {
    const port = this.portsForm.get('startPort');
    let translateToken: string;
    let param: { value?: string } = {};

    if (port.hasError('min')) {
      translateToken = 'SECURITY_GROUP_PAGE.RULES.START_PORT_SHOULD_BE_GREATER_THAN';
      param = { value: port.errors.min.min };
    } else if (port.hasError('max')) {
      translateToken = 'SECURITY_GROUP_PAGE.RULES.START_PORT_SHOULD_BE_LESS_THAN';
      param = { value: port.errors.max.max };
    } else if (port.hasError('startPortValidator')) {
      translateToken = 'SECURITY_GROUP_PAGE.RULES.START_PORT_SHOULD_BE_LESS_THAN_END_PORT';
    }

    if (translateToken) {
      return this.translateService.instant(translateToken, param);
    }
    return null;
  }

  public getEndPortErrorMessage() {
    const port = this.portsForm.get('endPort');
    let translateToken: string;
    let param: { value?: string } = {};

    if (port.hasError('min')) {
      translateToken = 'SECURITY_GROUP_PAGE.RULES.END_PORT_SHOULD_BE_GREATER_THAN';
      param = { value: port.errors.min.min };
    } else if (port.hasError('max')) {
      translateToken = 'SECURITY_GROUP_PAGE.RULES.END_PORT_SHOULD_BE_LESS_THAN';
      param = { value: port.errors.max.max };
    } else if (port.hasError('endPortValidator')) {
      translateToken = 'SECURITY_GROUP_PAGE.RULES.END_PORT_SHOULD_BE_GREATER_THAN_START_PORT';
    }

    if (translateToken) {
      return this.translateService.instant(translateToken, param);
    }
    return null;
  }

  private setPortFormValidators() {
    const portCommonValidators = [
      Validators.required,
      Validators.min(this.minPortNumber),
      Validators.max(this.maxPortNumber),
    ];
    this.startPort.setValidators([...portCommonValidators, startPortValidator(this.endPort)]);
    this.endPort.setValidators([...portCommonValidators, endPortValidator(this.startPort)]);
  }

  private setIcmpFormValidators() {
    this.icmpType.setValidators([Validators.required, icmpTypeValidator(this.cidr)]);
    this.icmpCode.setValidators([Validators.required, icmpCodeValidator(this.cidr, this.icmpType)]);
  }

  private getFormData(): FirewallRule {
    const formModel = this.ruleForm.value;
    const commonProperties: FirewallRule = {
      type: formModel.type,
      protocol: formModel.protocol,
      cidr: formModel.cidr,
    };
    if (commonProperties.protocol === NetworkProtocol.ICMP) {
      const icmpModel = this.icmpForm.value;
      return {
        ...commonProperties,
        icmpType: icmpModel.icmpType,
        icmpCode: icmpModel.icmpCode,
      };
    }
    const portsModel = this.portsForm.value;
    return {
      ...commonProperties,
      startPort: portsModel.startPort,
      endPort: portsModel.endPort,
    };
  }

  private resetForm() {
    const paramsForm =
      this.protocol.value === NetworkProtocol.ICMP ? this.icmpForm : this.portsForm;
    const formState = {
      type: this.type.value,
      protocol: this.protocol.value,
      cidr: this.cidr.value,
      params: paramsForm,
    };
    this.mainForm.resetForm();
    this.ruleForm.reset(formState);
  }

  private onProtocolChange() {
    this.protocolChanges = this.protocol.valueChanges
      .pipe(
        filter(Boolean),
        map((protocol: NetworkProtocol) => protocol === NetworkProtocol.ICMP),
        distinctUntilChanged(),
        filter((isIcmp: boolean) => this.isIcmpProtocol !== isIcmp),
      )
      .subscribe((isIcmp: boolean) => {
        // invokes only if isIcmpProtocol flag changes
        const paramsForm = isIcmp ? this.icmpForm : this.portsForm;
        this.ruleForm.setControl('params', paramsForm);
        this.isIcmpProtocol = isIcmp;

        if (isIcmp) {
          this.updateIcmpFormState();
        }
      });
  }

  private onCidrChange() {
    this.cidrChanges = this.cidr.valueChanges
      .pipe(
        map(CidrUtils.getCidrIpVersion),
        distinctUntilChanged(),
        filter(() => this.isIcmpProtocol),
      )
      .subscribe(() => {
        // invokes only when cidr change IP version and protocol equals ICMP
        this.updateIcmpFormState();
      });
  }

  private updateIcmpFormState() {
    this.updateIcmpFormFieldsValidity();

    this.updateDisabledStatusOnIcmpTypeField();
    this.updateDisabledStatusOnIcmpCodeField();

    this.updateFilteredIcmpTypes(this.icmpType.value);
    this.updateFilteredIcmpCodes(this.icmpCode.value);
  }

  private updateIcmpFormFieldsValidity() {
    this.icmpType.updateValueAndValidity();
    this.icmpCode.updateValueAndValidity();
  }

  private onPortsChanges() {
    this.startPortChanges = this.startPort.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((value: number) => {
        this.duplicatePortForFirstFilling(this.endPort, value);
        this.endPort.updateValueAndValidity();
      });

    this.endPortChanges = this.endPort.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((value: number) => {
        this.duplicatePortForFirstFilling(this.startPort, value);
        this.startPort.updateValueAndValidity();
      });
  }

  private duplicatePortForFirstFilling(port: AbstractControl, portNumber: number) {
    const isChangedByUser = port.untouched;
    if (isChangedByUser) {
      port.setValue(portNumber);
      port.markAsDirty();
    }
  }

  private onIcmpTypeChange() {
    this.icmpTypeChanges = this.icmpType.valueChanges.subscribe(value => {
      this.updateFilteredIcmpTypes(value);
      this.updateFilteredIcmpCodes(this.icmpCode.value);
      this.updateDisabledStatusOnIcmpCodeField();
    });
  }

  private updateFilteredIcmpTypes(value: number | string) {
    this.filteredIcmpTypes = this.filterIcmpTypes(value);
  }

  private filterIcmpTypes(val: number | string | null): IcmpType[] {
    if (val === null || val === '') {
      return this.getIcmpTypes();
    }
    const filterValue = val.toString().toLowerCase();

    return this.getIcmpTypes().filter(el => {
      return (
        el.type.toString() === filterValue ||
        this.translateService
          .instant(this.getIcmpTypeTranslationToken(el.type))
          .toLowerCase()
          .indexOf(filterValue) !== -1
      );
    });
  }

  private onIcmpCodeChange() {
    this.icmpCodeChanges = this.icmpCode.valueChanges.subscribe(value => {
      this.updateFilteredIcmpCodes(value);
    });
  }

  private updateFilteredIcmpCodes(value: number | string) {
    this.filteredIcmpCodes = this.filterIcmpCodes(value);
  }

  private filterIcmpCodes(val: number | string | null) {
    if (val === null || val === '') {
      return this.getIcmpCodes();
    }
    const filterValue = val.toString().toLowerCase();
    const icmpType = this.icmpType.value;

    return this.getIcmpCodes().filter(code => {
      return (
        code.toString().indexOf(filterValue) !== -1 ||
        this.translateService
          .instant(this.getIcmpCodeTranslationToken(icmpType, code))
          .toLowerCase()
          .indexOf(filterValue) !== -1
      );
    });
  }

  private updateDisabledStatusOnIcmpTypeField() {
    if (this.cidr.valid) {
      this.icmpType.enable();
    } else {
      this.icmpType.disable();
    }
  }

  private updateDisabledStatusOnIcmpCodeField() {
    if (this.icmpType.valid) {
      this.icmpCode.enable();
    } else {
      this.icmpCode.disable();
    }
  }

  private getIcmpTypes(): IcmpType[] {
    const cidrIpVersion = CidrUtils.getCidrIpVersion(this.cidr.value);
    if (!cidrIpVersion) {
      return [];
    }
    return cidrIpVersion === IPVersion.ipv6 ? icmpV6Types : icmpV4Types;
  }

  private getIcmpCodes(): number[] {
    const type: string | number = this.icmpType.value;
    // type === 0 is valid value so we can't use !type
    if (type === null || type === '') {
      return [];
    }
    const numType = +type;
    const typeObj = this.getIcmpTypes().find(el => {
      return el.type === numType;
    });
    return typeObj ? typeObj.codes : [];
  }

  private getIcmpTypeTranslationToken(type: number) {
    const cidrIpVersion = CidrUtils.getCidrIpVersion(this.cidr.value);
    if (!cidrIpVersion) {
      return;
    }
    return cidrIpVersion === IPVersion.ipv6
      ? getICMPV6TypeTranslationToken(type)
      : getICMPTypeTranslationToken(type);
  }

  private getIcmpCodeTranslationToken(type: number, code: number) {
    const cidrIpVersion = CidrUtils.getCidrIpVersion(this.cidr.value);
    if (!cidrIpVersion) {
      return;
    }
    return cidrIpVersion === IPVersion.ipv6
      ? getICMPV6CodeTranslationToken(type, code)
      : getICMPCodeTranslationToken(type, code);
  }

  private get type(): AbstractControl | null {
    return this.ruleForm.get('type');
  }

  private get protocol(): AbstractControl | null {
    return this.ruleForm.get('protocol');
  }

  private get cidr(): AbstractControl | null {
    return this.ruleForm.get('cidr');
  }

  public get startPort(): AbstractControl | null {
    return this.portsForm.get('startPort');
  }

  private get endPort(): AbstractControl | null {
    return this.portsForm.get('endPort');
  }

  private get icmpType(): AbstractControl | null {
    return this.icmpForm.get('icmpType');
  }

  private get icmpCode(): AbstractControl | null {
    return this.icmpForm.get('icmpCode');
  }
}
