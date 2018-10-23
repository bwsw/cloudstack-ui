import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { SnackBarService } from '../../core/services';
import { NetworkRuleService } from '../services/network-rule.service';
import { getType, IPVersion, NetworkRuleType, SecurityGroup, SecurityGroupType } from '../sg.model';
import { NetworkProtocol, NetworkRule } from '../network-rule.model';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { SgRuleComponent } from './sg-rule.component';
import { FirewallRule } from '../shared/models';
import { SecurityGroupViewMode } from '../sg-view-mode';
import { CidrUtils } from '../../shared/utils/cidr-utils';

@Component({
  selector: 'cs-security-group-rules',
  templateUrl: 'sg-rules.component.html',
  styleUrls: ['sg-rules.component.scss'],
})
export class SgRulesComponent implements OnInit, OnChanges {
  @Input()
  public securityGroup: SecurityGroup;
  @Input()
  public editMode = false;
  @Input()
  public vmId: string;
  @Output()
  public closeDialog = new EventEmitter();
  @Output()
  public firewallRulesChanged = new EventEmitter<SecurityGroup>();

  public selectedIPVersion: string[] = [];
  public selectedTypes: string[] = [];
  public selectedProtocols: string[] = [];
  public selectedGroupings = [];

  public ingressRules = [];
  public egressRules = [];
  public visibleRules: NetworkRule[] = [];

  public adding: boolean;

  public ipVersions = [IPVersion.ipv4, IPVersion.ipv6];

  public inputs;
  public outputs;
  public ruleComponent = SgRuleComponent;

  public groupings = [
    {
      key: 'types',
      label: 'SECURITY_GROUP_PAGE.FILTERS.TYPES',
      selector: (item: NetworkRule) => item.type,
      name: (item: NetworkRule) =>
        this.translateService.instant(
          `SECURITY_GROUP_PAGE.RULES.${item.type.toUpperCase()}_DISPLAY`,
        ),
    },
    {
      key: 'protocols',
      label: 'SECURITY_GROUP_PAGE.FILTERS.PROTOCOLS',
      selector: (item: NetworkRule) => item.protocol,
      name: (item: NetworkRule) => `SECURITY_GROUP_PAGE.RULES.${item.protocol.toUpperCase()}`,
    },
  ];

  public types = [
    { value: NetworkRuleType.Ingress, text: 'SECURITY_GROUP_PAGE.RULES.INGRESS' },
    { value: NetworkRuleType.Egress, text: 'SECURITY_GROUP_PAGE.RULES.EGRESS' },
  ];

  public protocols = [
    { value: NetworkProtocol.TCP, text: 'SECURITY_GROUP_PAGE.RULES.TCP' },
    { value: NetworkProtocol.UDP, text: 'SECURITY_GROUP_PAGE.RULES.UDP' },
    { value: NetworkProtocol.ICMP, text: 'SECURITY_GROUP_PAGE.RULES.ICMP' },
  ];

  public get isPredefinedTemplate(): boolean {
    return (
      this.securityGroup && getType(this.securityGroup) === SecurityGroupType.PredefinedTemplate
    );
  }

  constructor(
    private networkRuleService: NetworkRuleService,
    private notificationService: SnackBarService,
    private translateService: TranslateService,
    private dialogService: DialogService,
    private router: Router,
  ) {
    this.adding = false;
  }

  public ngOnInit() {
    this.inputs = {
      type: item => item.type,
      canRemove: this.editMode && !this.isPredefinedTemplate,
    };

    this.outputs = {
      removed: ({ type, id }) => this.removeRule({ type, id }),
    };
  }

  public ngOnChanges(changes) {
    this.update();
  }

  public onAddRule(rule: FirewallRule): void {
    this.adding = true;

    const data: any = {
      securitygroupid: this.securityGroup.id,
      protocol: rule.protocol,
      cidrList: rule.cidr,
    };
    if (rule.protocol === NetworkProtocol.ICMP) {
      data.icmptype = rule.icmpType;
      data.icmpcode = rule.icmpCode;
    } else {
      data.startport = rule.startPort;
      data.endport = rule.endPort;
    }

    this.networkRuleService.addRule(rule.type, data).subscribe(
      createdRule => {
        createdRule.type = rule.type;

        if (createdRule.type === NetworkRuleType.Ingress) {
          this.ingressRules.push(createdRule);
        } else {
          this.egressRules.push(createdRule);
        }

        this.emitChanges();
        this.filter();
        this.adding = false;
      },
      () => {
        this.notificationService.open('SECURITY_GROUP_PAGE.RULES.FAILED_TO_ADD_RULE').subscribe();
        this.adding = false;
      },
    );
  }

  public removeRule({ type, id }): void {
    this.networkRuleService.removeRule(type, { id }).subscribe(
      () => {
        const rules = type === NetworkRuleType.Ingress ? this.ingressRules : this.egressRules;
        const ind = rules.findIndex(rule => rule.ruleid === id);
        if (ind === -1) {
          return;
        }
        rules.splice(ind, 1);
        this.emitChanges();
        this.filter();
      },
      () => {
        this.translateService
          .get(['SECURITY_GROUP_PAGE.RULES.FAILED_TO_REMOVE_RULE'])
          .subscribe(translations => {
            this.notificationService
              .open(translations['SECURITY_GROUP_PAGE.RULES.FAILED_TO_REMOVE_RULE'])
              .subscribe();
          });
      },
    );
  }

  public filter(): void {
    if (!this.securityGroup) {
      return;
    }
    const filteredEgressRules = this.filterRules(this.egressRules);
    const filteredIngressRules = this.filterRules(this.ingressRules);
    this.visibleRules = [...filteredIngressRules, ...filteredEgressRules];
  }

  public confirmChangeMode() {
    if (!this.editMode && getType(this.securityGroup) === SecurityGroupType.Shared) {
      this.dialogService
        .confirm({
          message: !this.vmId
            ? 'DIALOG_MESSAGES.SECURITY_GROUPS.CONFIRM_EDIT'
            : 'DIALOG_MESSAGES.SECURITY_GROUPS.CONFIRM_EDIT_FROM_VM',
        })
        .subscribe(res => {
          if (res) {
            if (this.vmId) {
              this.router.navigate(['security-group', this.securityGroup.id, 'rules'], {
                queryParams: {
                  vm: this.vmId,
                  viewMode: SecurityGroupViewMode.Shared,
                },
              });
              this.closeDialog.emit();
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
      this.ingressRules = this.securityGroup.ingressrule.map(rule => ({
        ...rule,
        type: NetworkRuleType.Ingress,
      }));
      this.egressRules = this.securityGroup.egressrule.map(rule => ({
        ...rule,
        type: NetworkRuleType.Egress,
      }));
    }

    this.filter();
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
        const ruleIPversion =
          item.cidr && CidrUtils.getCidrIpVersion(item.cidr) === IPVersion.ipv6
            ? IPVersion.ipv6
            : IPVersion.ipv4;
        return (
          !this.selectedIPVersion.length ||
          this.selectedIPVersion.find(version => version === ruleIPversion)
        );
      };
      const filterByProtocol = (item: NetworkRule) =>
        !this.selectedProtocols.length ||
        this.selectedProtocols.find(protocol => protocol === item.protocol);
      const filterByTypes = (item: NetworkRule) =>
        !this.selectedTypes.length || this.selectedTypes.find(type => item.type === type);

      return filterByTypes(rule) && filterByIPversion(rule) && filterByProtocol(rule);
    });
  }

  private emitChanges() {
    const updatedSecurityGroup = {
      ...this.securityGroup,
      ingressrule: this.ingressRules,
      egressrule: this.egressRules,
    };
    this.firewallRulesChanged.emit(updatedSecurityGroup);
  }
}
