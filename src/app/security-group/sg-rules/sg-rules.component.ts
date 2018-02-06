import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import {
  GetICMPCodeTranslationToken,
  GetICMPTypeTranslationToken,
  GetICMPV6CodeTranslationToken,
  GetICMPV6TypeTranslationToken,
  ICMPType,
  ICMPtypes,
  ICMPv6Types
} from '../../shared/icmp/icmp-types';
import { NotificationService } from '../../shared/services/notification.service';
import { Utils } from '../../shared/services/utils/utils.service';
import { NetworkRuleService } from '../services/network-rule.service';
import {
  getType,
  IPVersion, NetworkRuleType, SecurityGroup,
  SecurityGroupType
} from '../sg.model';
import { NetworkProtocol, NetworkRule } from '../network-rule.model';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { Router } from '@angular/router';
import { SgRuleComponent } from './sg-rule.component';

export class CidrStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const invalidCidr = control.value && !Utils.cidrIsValid(control.value);

    return control && (control.dirty || control.touched) && invalidCidr;
  }
}

@Component({
  selector: 'cs-security-group-rules',
  templateUrl: 'sg-rules.component.html',
  styleUrls: ['sg-rules.component.scss']
})
export class SgRulesComponent implements OnChanges {
  @Input() public securityGroup: SecurityGroup;
  @Input() public editMode = false;
  @Input() public vmId: string;
  @Output() public onCloseDialog = new EventEmitter();
  @Output() public onFirewallRulesChange = new EventEmitter<SecurityGroup>();

  @ViewChild('rulesForm') public rulesForm: NgForm;
  public selectedType = '';
  public selectedCode = '';
  public selectedIPVersion: string[] = [];
  public selectedTypes: string[] = [];
  public selectedProtocols: string[] = [];

  public type: NetworkRuleType;
  public protocol: NetworkProtocol;
  public startPort: number;
  public icmpType: number;
  public icmpCode: number;
  public icmpCodes: number[];
  public endPort: number;
  public cidr: string;
  public cidrMatcher = new CidrStateMatcher();
  public ingressRules = [];
  public egressRules = [];
  public visibleRules: NetworkRule[] = [];

  public adding: boolean;

  public IPversions = [IPVersion.ipv4, IPVersion.ipv6];
  public NetworkProtocols = NetworkProtocol;
  public NetworkRuleTypes = NetworkRuleType;

  public inputs;
  public outputs;
  public ruleComponent = SgRuleComponent;

  public selectedGroupings = [];
  public groupings = [
    {
      key: 'types',
      label: 'SECURITY_GROUP_PAGE.FILTERS.TYPES',
      selector: (item: NetworkRule) => item.type,
      name: (item: NetworkRule) => this.translateService
        .instant(`SECURITY_GROUP_PAGE.RULES.${item.type.toUpperCase()}_DISPLAY`)
    }, {
      key: 'protocols',
      label: 'SECURITY_GROUP_PAGE.FILTERS.PROTOCOLS',
      selector: (item: NetworkRule) => item.protocol,
      name: (item: NetworkRule) => 'SECURITY_GROUP_PAGE.RULES.' + item.protocol.toUpperCase()
    }
  ];

  public types = [
    { value: NetworkRuleType.Ingress, text: 'SECURITY_GROUP_PAGE.RULES.INGRESS' },
    { value: NetworkRuleType.Egress, text: 'SECURITY_GROUP_PAGE.RULES.EGRESS' },
  ];

  public protocols = [
    { value: NetworkProtocol.TCP, text: 'SECURITY_GROUP_PAGE.RULES.TCP' },
    { value: NetworkProtocol.UDP, text: 'SECURITY_GROUP_PAGE.RULES.UDP' },
    { value: NetworkProtocol.ICMP, text: 'SECURITY_GROUP_PAGE.RULES.ICMP' }
  ];

  private _icmpTypes: ICMPType[];

  public get isPredefinedTemplate(): boolean {
    return this.securityGroup && getType(this.securityGroup) === SecurityGroupType.PredefinedTemplate;
  }

  public get icmpTypes(): ICMPType[] {
    return this._icmpTypes ? this._icmpTypes : this.typesByCIDR;
  }

  public isCidrValid(input: string) {
    return input && Utils.cidrIsValid(input);
  }

  constructor(
    private networkRuleService: NetworkRuleService,
    private notificationService: NotificationService,
    private translateService: TranslateService,
    private dialogService: DialogService,
    private router: Router
  ) {
    this.protocol = NetworkProtocol.TCP;
    this.type = NetworkRuleType.Ingress;

    this.adding = false;
    this.inputs = {
      type: item => item.type,
      canRemove: this.editMode && !this.isPredefinedTemplate
    };

    this.outputs = {
      onRemove: ({ type, id }) => this.removeRule({ type, id })
    };
  }

  public ngOnChanges(changes) {
    this.update();
  }

  public addRule(e: Event): void {
    e.stopPropagation();

    const type = this.type;
    const params: any = {
      securityGroupId: this.securityGroup.id,
      protocol: this.protocol.toLowerCase(),
      cidrList: this.cidr
    };

    if (this.protocol === NetworkProtocol.ICMP) {
      params.icmptype = this.icmpType;
      params.icmpcode = this.icmpCode;
    } else {
      params.startport = this.startPort;
      params.endport = this.endPort;
    }

    this.adding = true;

    this.networkRuleService.addRule(type, params)
      .subscribe(
        rule => {
          rule.type = type;

          if (type === NetworkRuleType.Ingress) {
            this.ingressRules.push(rule);
          } else {
            this.egressRules.push(rule);
          }

          this.emitChanges();
          this.resetForm();
          this.filter();
          this.adding = false;
        },
        () => {
          this.notificationService.message('SECURITY_GROUP_PAGE.RULES.FAILED_TO_ADD_RULE');
          this.adding = false;
        }
      );
  }

  public removeRule({ type, id }): void {
    this.networkRuleService.removeRule(type, { id })
      .subscribe(() => {
        const rules = type === NetworkRuleType.Ingress
          ? this.ingressRules
          : this.egressRules;
        const ind = rules.findIndex(rule => rule.ruleId === id);
        if (ind === -1) {
          return;
        }
        rules.splice(ind, 1);
        this.emitChanges();
        this.filter();
      }, () => {
        this.translateService.get(['SECURITY_GROUP_PAGE.RULES.FAILED_TO_REMOVE_RULE'])
          .subscribe((translations) => {
            this.notificationService.message(translations['SECURITY_GROUP_PAGE.RULES.FAILED_TO_REMOVE_RULE']);
          });
      });
  }

  public setIcmpTypes(value: ICMPType[]) {
    this._icmpTypes = value;

    if (+this.selectedType <= 255 && +this.selectedType >= -1) {
      this.icmpType = +this.selectedType;
      const type = this.typesByCIDR.find(_ => {
        return _.type === this.icmpType;
      });
      this.selectedCode = '';
      this.icmpCodes = type ? type.codes : [];
    }
  }

  public setIcmpCodes(value: number[]) {
    this.icmpCodes = value;

    if (+this.selectedCode <= 255 && +this.selectedCode >= -1) {
      this.icmpCode = +this.selectedCode;
    }
  }

  public get typesByCIDR(): ICMPType[] {
    return this.cidrIpVersion ? ICMPv6Types : ICMPtypes;
  }

  public get IPVersion() {
    return IPVersion;
  }

  public get cidrIpVersion(): IPVersion {
    return this.cidr && Utils.cidrType(this.cidr) === IPVersion.ipv6
      ? IPVersion.ipv6
      : IPVersion.ipv4;
  }

  public onCidrChange() {
    this._icmpTypes = this.typesByCIDR;
  }

  public filter(): void {
    if (!this.securityGroup) {
      return;
    }
    const filteredEgressRules = this.filterRules(this.egressRules);
    const filteredIngressRules = this.filterRules(this.ingressRules);
    this.visibleRules = [...filteredIngressRules, ...filteredEgressRules];
  }

  public filterTypes(val: number | string) {
    const filterValue = val.toString().toLowerCase();
    return !!val ? this.typesByCIDR.filter(_ => _.type.toString() === filterValue ||
      this.translateService.instant(this.getIcmpTypeTranslationToken(_.type))
        .toLowerCase()
        .indexOf(filterValue) !== -1) : this.typesByCIDR;
  }

  public filterCodes(val: number | string) {
    const filterValue = val.toString().toLowerCase();
    return !!val ? this.icmpCodes.filter(_ =>
      _.toString().indexOf(filterValue) !== -1 ||
      this.translateService.instant(this.getIcmpCodeTranslationToken(this.icmpType, _))
        .toLowerCase()
        .indexOf(filterValue) !== -1) : this.typesByCIDR.find(
      x => x.type === this.icmpType).codes;
  }

  public confirmChangeMode() {
    if (!this.editMode && getType(this.securityGroup) === SecurityGroupType.Shared) {
      this.dialogService.confirm({
        message: !this.vmId
          ? 'DIALOG_MESSAGES.SECURITY_GROUPS.CONFIRM_EDIT'
          : 'DIALOG_MESSAGES.SECURITY_GROUPS.CONFIRM_EDIT_FROM_VM'
      })
        .subscribe((res) => {
          if (res) {
            if (this.vmId) {
              this.router.navigate([
                'security-group', this.securityGroup.id, 'rules'
              ], {
                queryParams: { vm: this.vmId }
              });
              this.onCloseDialog.emit();
            } else {
              this.changeMode();
            }
          }
        });
    } else {
      this.changeMode();
    }
  }

  private changeMode() {
    this.resetFilters();
    this.editMode = !this.editMode;
    this.inputs.canRemove = this.editMode;
  }

  private update() {
    if (this.securityGroup) {
      this.ingressRules = this.securityGroup.ingressRules
        .map(rule => ({ ...rule, type: NetworkRuleType.Ingress }));
      this.egressRules = this.securityGroup.egressRules
        .map(rule => ({ ...rule, type: NetworkRuleType.Egress }));
    }

    this.filter();
  }

  private resetForm(): void {
    // reset controls' state. instead of just setting ngModel bound variables to empty string
    // we reset controls to reset the validity state of inputs
    const controlNames = ['icmpTypeSelect', 'icmpCodeSelect', 'startPort', 'endPort'];
    controlNames.forEach((key) => {
      const control = this.rulesForm.controls[key];
      if (control) {
        control.reset();
      }
    });
  }

  private resetFilters() {
    this.selectedTypes = [];
    this.selectedProtocols = [];
    this.selectedIPVersion = [];
    this.filter();
  }

  private filterRules(rules: NetworkRule[]) {
    return rules.filter((rule: NetworkRule) => {
      const filterByIPversion = (item: NetworkRule) => {
        const ruleIPversion = item.CIDR && Utils.cidrType(item.CIDR) === IPVersion.ipv6
          ? IPVersion.ipv6
          : IPVersion.ipv4;
        return !this.selectedIPVersion.length
          || this.selectedIPVersion.find(version => version === ruleIPversion);
      };
      const filterByProtocol = (item: NetworkRule) => !this.selectedProtocols.length
        || this.selectedProtocols.find(protocol => protocol === item.protocol);
      const filterByTypes = (item: NetworkRule) => !this.selectedTypes.length
        || this.selectedTypes.find(type => item.type === type);

      return filterByTypes(rule) && filterByIPversion(rule) && filterByProtocol(rule);
    });
  }

  public getIcmpTypeTranslationToken(type: number) {
    return this.cidrIpVersion === IPVersion.ipv6
      ? GetICMPV6TypeTranslationToken(type)
      : GetICMPTypeTranslationToken(type);
  }

  public getIcmpCodeTranslationToken(type: number, code: number) {
    return this.cidrIpVersion === IPVersion.ipv6
      ? GetICMPV6CodeTranslationToken(type, code)
      : GetICMPCodeTranslationToken(type, code);
  }

  private emitChanges() {
    const updatedSecurityGroup = new SecurityGroup(this.securityGroup);
    updatedSecurityGroup.ingressRules = this.ingressRules;
    updatedSecurityGroup.egressRules = this.egressRules;
    this.onFirewallRulesChange.emit(updatedSecurityGroup);
  }
}
