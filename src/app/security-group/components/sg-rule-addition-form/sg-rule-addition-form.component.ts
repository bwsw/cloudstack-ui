import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';
import { ErrorStateMatcher } from '@angular/material';

import { IPVersion, NetworkRuleType } from '../../sg.model';
import { NetworkProtocol } from '../../network-rule.model';
import { Utils } from '../../../shared/services/utils/utils.service';
import {
  cidrValidator,
  endPortValidator,
  icmpV4CodeValidator,
  icmpV4TypeValidator,
  icmpV6CodeValidator,
  icmpV6TypeValidator,
  startPortValidator
} from '../../shared/validators';
import {
  GetICMPCodeTranslationToken,
  GetICMPTypeTranslationToken,
  GetICMPV6CodeTranslationToken,
  GetICMPV6TypeTranslationToken,
  IcmpType,
  icmpV4Types,
  icmpV6Types
} from '../../../shared/icmp/icmp-types';
import 'rxjs/add/operator/startWith';
import { FirewallRule } from '../../shared/models';


function isExist(value: any): boolean {
  return !!value
}

function getIpVersionByCidr(cidr: string): IPVersion {
  return Utils.cidrType(cidr);
}

export class PortsErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl, form: FormGroupDirective | NgForm): boolean {
    return control.invalid && control.dirty;
  }
}


@Component({
  selector: 'cs-sg-rule-addition-form',
  templateUrl: './sg-rule-addition-form.component.html',
  styleUrls: ['./sg-rule-addition-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SGRuleAdditionFormComponent implements OnDestroy {
  // Workaround for resetting form state. https://github.com/angular/material2/issues/4190
  // We need manually reset FormGroupDirective via resetForm() method otherwise,
  // the form will be invalid and errors are shown
  @ViewChild('mainForm') mainForm;
  @Input() isAdding = false;
  @Output() addRule = new EventEmitter<FirewallRule>();

  public isIcmpProtocol = false;
  public filteredIcmpTypes: IcmpType[];
  public filteredIcmpCodes: number[];
  public portMatcher = new PortsErrorStateMatcher();

  public types = [
    { value: NetworkRuleType.Ingress, text: 'SECURITY_GROUP_PAGE.RULES.INGRESS' },
    { value: NetworkRuleType.Egress, text: 'SECURITY_GROUP_PAGE.RULES.EGRESS' },
  ];

  public protocols = [
    { value: NetworkProtocol.TCP, text: 'SECURITY_GROUP_PAGE.RULES.TCP' },
    { value: NetworkProtocol.UDP, text: 'SECURITY_GROUP_PAGE.RULES.UDP' },
    { value: NetworkProtocol.ICMP, text: 'SECURITY_GROUP_PAGE.RULES.ICMP' }
  ];

  public ruleForm: FormGroup;
  private portsForm: FormGroup;
  private icmpForm: FormGroup;

  private readonly maxPortNumber = 65535;
  private readonly minPortNumber = 0;

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
      startPort: [null],
      endPort: [null]
    });
    this.setPortFormValidators();

    this.icmpForm = this.fb.group({
      icmpType: [{ value: null, disabled: true }, [Validators.required]],
      icmpCode: [{ value: null, disabled: true }, [Validators.required]]
    });

    this.ruleForm = this.fb.group({
      type: this.types[0].value,
      protocol: this.protocols[0].value,
      cidr: ['', [Validators.required, cidrValidator()]],
      params: this.portsForm // Depends on initial value of protocol
    });
  }

  public onSubmit() {
    const rule = this.getFormData();
    this.addRule.emit(rule);

    this.resetForm();
  }

  public getStartPortErrorMessage() {
    const port = this.portsForm.get('startPort');
    let translateToken = 'SECURITY_GROUP_PAGE.RULES.';
    let param: { value?: string } = {};

    if (port.hasError('required')) {
      translateToken += 'FILED_REQUIRED';
    } else if (port.hasError('min')) {
      translateToken += 'START_PORT_SHOULD_BE_GREATER_THAN';
      param = { value: port.errors.min.min }
    } else if (port.hasError('max')) {
      translateToken += 'START_PORT_SHOULD_BE_LESS_THAN';
      param = { value: port.errors.max.max }
    } else if (port.hasError('startPortValidator')) {
      translateToken += 'START_PORT_SHOULD_BE_LESS_THAN_END_PORT';
    }

    return this.translateService.instant(translateToken, param);
  }

  public getEndPortErrorMessage() {
    const port = this.portsForm.get('endPort');
    let translateToken = 'SECURITY_GROUP_PAGE.RULES.';
    let param: { value?: string } = {};

    if (port.hasError('required')) {
      translateToken += 'FILED_REQUIRED';
    } else if (port.hasError('min')) {
      translateToken += 'END_PORT_SHOULD_BE_GREATER_THAN';
      param = { value: port.errors.min.min }
    } else if (port.hasError('max')) {
      translateToken += 'END_PORT_SHOULD_BE_LESS_THAN';
      param = { value: port.errors.max.max }
    } else if (port.hasError('endPortValidator')) {
      translateToken += 'END_PORT_SHOULD_BE_GREATER_THAN_START_PORT';
    }

    return this.translateService.instant(translateToken, param);
  }

  private getFormData(): FirewallRule {
    const formModel = this.ruleForm.value;
    const rule: FirewallRule = {
      type: formModel.type,
      protocol: formModel.protocol,
      cidr: formModel.cidr
    };
    if (rule.protocol === NetworkProtocol.ICMP) {
      const icmpModel = this.icmpForm.value;
      rule.icmpType = icmpModel.icmpType;
      rule.icmpCode = icmpModel.icmpCode;
    } else {
      const portsModel = this.portsForm.value;
      rule.startPort = portsModel.startPort;
      rule.endPort = portsModel.endPort;
    }
    return rule;
  }

  private resetForm() {
    const paramsForm = this.ruleForm.get('protocol').value === NetworkProtocol.ICMP ? this.icmpForm : this.portsForm;
    const formState = {
      type: this.ruleForm.get('type').value,
      protocol: this.ruleForm.get('protocol').value,
      cidr: this.ruleForm.get('cidr').value,
      params: paramsForm
    };
    this.mainForm.resetForm();
    this.ruleForm.reset(formState);
  }

  private setPortFormValidators() {
    const portCommonValidators = [
      Validators.required,
      Validators.min(this.minPortNumber),
      Validators.max(this.maxPortNumber)
    ];
    const startPort = this.portsForm.get('startPort');
    const endPort = this.portsForm.get('endPort');
    startPort.setValidators([...portCommonValidators, startPortValidator(endPort)]);
    endPort.setValidators([...portCommonValidators, endPortValidator(startPort)]);
  }

  private onProtocolChange() {
    this.protocolChanges = this.ruleForm.get('protocol').valueChanges
      .filter(isExist)
      .map((protocol: NetworkProtocol) => protocol === NetworkProtocol.ICMP)
      .distinctUntilChanged()
      .filter((isIcmp: boolean) => this.isIcmpProtocol !== isIcmp)
      .subscribe((isIcmp: boolean) => {
        const paramsForm = isIcmp ? this.icmpForm : this.portsForm;
        this.ruleForm.setControl('params', paramsForm);
        this.isIcmpProtocol = isIcmp;
      });
  }

  private onCidrChange() {
    this.cidrChanges = this.ruleForm.get('cidr').valueChanges
      .filter(isExist)
      .map(getIpVersionByCidr)
      .distinctUntilChanged()
      .subscribe(() => {
        const icmpType = this.icmpForm.get('icmpType').value;
        this.updateFilteredIcmpTypes(icmpType);
        this.updateIcmpTypeValidators();
        this.updateDisabledStatusOnIcmpTypeField();

        const icmpCode = this.icmpForm.get('icmpCode').value;
        this.updateFilteredIcmpCodes(icmpCode);
      });
  }

  private onPortsChanges() {
    this.startPortChanges = this.portsForm.get('startPort').valueChanges
      .distinctUntilChanged()
      .subscribe((value: number) => {
        this.duplicatePortForFirstFilling('endPort', value);
        this.portsForm.get('endPort').updateValueAndValidity();
      });

    this.endPortChanges = this.portsForm.get('endPort').valueChanges
      .distinctUntilChanged()
      .subscribe((value: number) => {
        this.duplicatePortForFirstFilling('startPort', value);
        this.portsForm.get('startPort').updateValueAndValidity();
      });
  }

  private duplicatePortForFirstFilling(portName: string, portNumber: number) {
    const isChangedByUser = this.portsForm.get(portName).untouched;
    if (isChangedByUser) {
      this.portsForm.patchValue({ [portName]: portNumber });
      this.portsForm.get(portName).markAsDirty();
    }
  }

  private onIcmpTypeChange() {
    this.icmpTypeChanges = this.icmpForm.get('icmpType').valueChanges
      .subscribe(value => {
        this.updateFilteredIcmpTypes(value);
        const icmpCode = this.icmpForm.get('icmpCode').value;
        this.updateFilteredIcmpCodes(icmpCode);
        this.updateIcmpCodeValidators();
        this.updateDisabledStatusOnIcmpCodeField();
      });
  }

  private updateFilteredIcmpTypes(value: number | string) {
    this.filteredIcmpTypes = this.filterIcmpTypes(value);
  }

  private filterIcmpTypes(val: number | string): IcmpType[] {
    if (!!val === false) {
      return this.getIcmpTypes();
    }
    return this.getIcmpTypes().filter(el => {
      const filterValue = val.toString().toLowerCase();

      return el.type.toString() === filterValue ||
        this.translateService.instant(this.getIcmpTypeTranslationToken(el.type))
          .toLowerCase()
          .indexOf(filterValue) !== -1
    });
  }

  private updateDisabledStatusOnIcmpTypeField() {
    const isValid = this.ruleForm.get('cidr').valid;

    if (isValid) {
      this.icmpForm.get('icmpType').enable();
    } else {
      this.icmpForm.get('icmpType').disable();
    }
  }

  private updateIcmpTypeValidators() {
    const v4Validators = [Validators.required, icmpV4TypeValidator()];
    const v6Validators = [Validators.required, icmpV6TypeValidator()];
    const ipVersion = getIpVersionByCidr(this.getCidr());
    const validators = ipVersion === IPVersion.ipv4 ? v4Validators : v6Validators;

    this.icmpForm.get('icmpType').setValidators(validators);
    this.icmpForm.get('icmpType').updateValueAndValidity();
  }

  private onIcmpCodeChange() {
    this.icmpCodeChanges = this.icmpForm.get('icmpCode').valueChanges
      .subscribe(value => {
        this.updateFilteredIcmpCodes(value);
      });
  }

  private updateFilteredIcmpCodes(value: number | string) {
    this.filteredIcmpCodes = this.filterIcmpCodes(value);
  }

  private filterIcmpCodes(val: number | string) {
    if (!!val === false) {
      return this.getIcmpCodes();
    }
    return this.getIcmpCodes().filter(code => {
      const filterValue = val.toString().toLowerCase();
      const icmpType = this.icmpForm.get('icmpType').value;

      return code.toString().indexOf(filterValue) !== -1 ||
        this.translateService.instant(this.getIcmpCodeTranslationToken(icmpType, code))
          .toLowerCase()
          .indexOf(filterValue) !== -1
    });
  }

  private updateIcmpCodeValidators() {
    const icmpTypeControl = this.icmpForm.get('icmpType');
    if (icmpTypeControl.invalid) {
      return;
    }
    const ipVersion = getIpVersionByCidr(this.getCidr());
    const v4Validators = [Validators.required, icmpV4CodeValidator(+icmpTypeControl.value)];
    const v6Validators = [Validators.required, icmpV6CodeValidator(+icmpTypeControl.value)];
    const validators = ipVersion === IPVersion.ipv4 ? v4Validators : v6Validators;

    this.icmpForm.get('icmpCode').setValidators(validators);
    this.icmpForm.get('icmpCode').updateValueAndValidity();
  }

  private updateDisabledStatusOnIcmpCodeField() {
    const isValid = this.icmpForm.get('icmpType').valid;

    if (isValid) {
      this.icmpForm.get('icmpCode').enable();
    } else {
      this.icmpForm.get('icmpCode').disable();
    }
  }

  private getIcmpTypes(): IcmpType[] {
    const cidrIpVersion = getIpVersionByCidr(this.getCidr());
    if (!cidrIpVersion) {
      return [];
    }
    return cidrIpVersion === IPVersion.ipv6 ? icmpV6Types : icmpV4Types;
  }

  private getIcmpCodes(): number[] {
    let type = this.icmpForm.get('icmpType').value;
    if (!type) {
      return [];
    }
    type = +type;
    const typeObj = this.getIcmpTypes().find(el => {
      return el.type === type;
    });
    return typeObj ? typeObj.codes : [];
  }

  private getIcmpTypeTranslationToken(type: number) {
    const cidrIpVersion = getIpVersionByCidr(this.getCidr());
    if (!cidrIpVersion) {
      return;
    }
    return cidrIpVersion === IPVersion.ipv6
      ? GetICMPV6TypeTranslationToken(type)
      : GetICMPTypeTranslationToken(type);
  }

  private getIcmpCodeTranslationToken(type: number, code: number) {
    const cidrIpVersion = getIpVersionByCidr(this.getCidr());
    if (!cidrIpVersion) {
      return;
    }
    return cidrIpVersion === IPVersion.ipv6
      ? GetICMPV6CodeTranslationToken(type, code)
      : GetICMPCodeTranslationToken(type, code);
  }

  private getCidr(): string {
    return this.ruleForm.get('cidr').value;
  }
}
