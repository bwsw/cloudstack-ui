import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  GetICMPCodeTranslationToken,
  GetICMPTypeTranslationToken,
  ICMPType,
  ICMPtypes
} from '../../shared/icmp/icmp-types';
import { NotificationService } from '../../shared/services/notification.service';
import { NetworkRuleService } from '../services/network-rule.service';
import { NetworkRuleType, SecurityGroup, SecurityGroupType } from '../sg.model';
import { NetworkProtocol, NetworkRule } from '../network-rule.model';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { Router } from '@angular/router';
import { SgRuleComponent } from './sg-rule.component';


@Component({
  selector: 'cs-security-group-rules',
  templateUrl: 'sg-rules.component.html',
  styleUrls: ['sg-rules.component.scss']
})
export class SgRulesComponent implements OnChanges {
  @Input() public securityGroup: any;
  @Input() public editMode = false;
  @Input() public vmId: string;
  @Output() public onCloseDialog = new EventEmitter();
  @Output() public onFirewallRulesChange = new EventEmitter<SecurityGroup>();

  @ViewChild('rulesForm') public rulesForm: NgForm;
  public selectedType = '';
  public selectedCode = '';
  public selectedTypes: string[] = [];
  public selectedProtocols: string[] = [];

  public type: NetworkRuleType;
  public protocol: NetworkProtocol;
  public startPort: number;
  public icmpType: number;
  public icmpTypes: ICMPType[] = ICMPtypes;
  public icmpCode: number;
  public icmpCodes: number[];
  public endPort: number;
  public cidr: string;
  public ingressRules: NetworkRule[] = [];
  public egressRules: NetworkRule[] = [];
  public visibleRules: NetworkRule[] = [];

  public adding: boolean;

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

  public getIcmpTypeTranslationToken = GetICMPTypeTranslationToken;
  public getIcmpCodeTranslationToken = GetICMPCodeTranslationToken;

  constructor(
    private networkRuleService: NetworkRuleService,
    private notificationService: NotificationService,
    private translateService: TranslateService,
    private dialogService: DialogService,
    private router: Router
  ) {
    this.cidr = '0.0.0.0/0';
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

  public get isPredefinedTemplate(): boolean {
    return this.securityGroup && this.securityGroup.type === SecurityGroupType.PredefinedTemplate;
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

  public onCidrClick(): void {
    if (!this.cidr) {
      this.cidr = '0.0.0.0/0';
    }
  }

  public setIcmpTypes(value: ICMPType[]) {
    this.icmpTypes = value;

    if (+this.selectedType <= 255 && +this.selectedType >= -1) {
      this.icmpType = +this.selectedType;
      const type = ICMPtypes.find(_ => {
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
    return !!val ? ICMPtypes.filter(_ => _.type.toString() === filterValue ||
      this.translateService.instant(this.getIcmpTypeTranslationToken(_.type))
        .toLowerCase()
        .indexOf(filterValue) !== -1) : ICMPtypes;
  }

  public filterCodes(val: number | string) {
    const filterValue = val.toString().toLowerCase();
    return !!val ? this.icmpCodes.filter(_ =>
      _.toString().indexOf(filterValue) !== -1 ||
      this.translateService.instant(this.getIcmpCodeTranslationToken(this.icmpType, _))
        .toLowerCase()
        .indexOf(filterValue) !== -1) : ICMPtypes.find(
      x => x.type === this.icmpType).codes;
  }

  public confirmChangeMode() {
    if (!this.editMode && this.securityGroup.type === SecurityGroupType.Shared) {
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
    this.filter();
  }

  private filterRules(rules: NetworkRule[]) {
    return rules.filter((rule: NetworkRule) => {
      return (!this.selectedProtocols.length
        || this.selectedProtocols.find(protocol => protocol === rule.protocol))
        && (!this.selectedTypes.length
          || this.selectedTypes.find(type => rule.type === type));
    });
  }

  private emitChanges() {
    const updatedSecurityGroup = new SecurityGroup(this.securityGroup);
    updatedSecurityGroup.ingressRules = this.ingressRules;
    updatedSecurityGroup.egressRules = this.egressRules;
    this.onFirewallRulesChange.emit(updatedSecurityGroup);
  }
}
