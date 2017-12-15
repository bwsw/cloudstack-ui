import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NetworkRule } from '../../../security-group/network-rule.model';
import { SecurityGroupService } from '../../../security-group/services/security-group.service';
import { NetworkRuleType, SecurityGroup, SecurityGroupType } from '../../../security-group/sg.model';
import { SecurityGroupTagKeys } from '../../services/tags/security-group-tag-keys';
import { Rules } from './rules';

export interface RuleListItem {
  rule: NetworkRule;
  checked: boolean;
  type: NetworkRuleTypes;
}

export enum SecurityGroupBuilderTemplates {
  NotSelected,
  Selected
}

export enum NetworkRuleTypes {
  Ingress,
  Egress
}

@Component({
  selector: 'cs-security-group-builder',
  templateUrl: 'security-group-builder.component.html',
  styleUrls: ['security-group-builder.component.scss'],
})
export class SecurityGroupBuilderComponent implements OnInit {
  @Input() public inputRules: Rules;
  @Output() public onChange = new EventEmitter<Rules>();

  public securityGroups: Array<Array<SecurityGroup>>;
  public selectedGroupIndex: number;
  public selectedColumnIndex: number;
  public selectedRules: Array<Array<RuleListItem>>;

  public get SecurityGroupBuilderTemplates() {
    return SecurityGroupBuilderTemplates;
  }

  public get NetworkRuleType() {
    return NetworkRuleType;
  }

  public get NetworkRuleTypes() {
    return NetworkRuleTypes;
  }

  constructor(private securityGroupService: SecurityGroupService) {
    this.securityGroups = [[], []];
    this.selectedRules = [[], []];
  }

  public ngOnInit(): void {
    const templates = this.securityGroupService.getPredefinedTemplates();
    const accountSecurityGroups = this.securityGroupService.getList({
      'tags[0].key': SecurityGroupTagKeys.type,
      'tags[0].value': SecurityGroupType.CustomTemplate
    });

    accountSecurityGroups
      .subscribe(groups => {
        this.securityGroups[SecurityGroupBuilderTemplates.NotSelected] = templates.concat(groups);

        this.initRulesList();
      });
  }

  public selectAll(): void {
    while (this.securityGroups[SecurityGroupBuilderTemplates.NotSelected].length) {
      this.selectedGroupIndex = 0;
      this.moveRight();
    }

    this.emitChange();
  }

  public reset(): void {
    while (this.securityGroups[SecurityGroupBuilderTemplates.Selected].length) {
      this.selectedGroupIndex = 0;
      this.moveLeft();
    }

    this.emitChange();
  }

  public selectGroup(index: number, left: boolean): void {
    this.selectedGroupIndex = index;
    this.selectedColumnIndex = left ? 0 : 1;
  }

  public moveLeft(): void {
    if (this.selectedGroupIndex === -1) {
      return;
    }

    this.removeIngressRulesOfSelectedGroup();
    this.removeEgressRulesOfSelectedGroup();
    this.moveSelectedGroupLeft();
    this.resetSelectedGroup();
    this.resetSelectedColumn();
    this.emitChange();
  }

  public moveRight(): void {
    if (this.selectedGroupIndex === -1) {
      return;
    }

    const group = this.securityGroups[SecurityGroupBuilderTemplates.NotSelected][this.selectedGroupIndex];

    this.pushAllIngressRulesOfGroup(group);
    this.pushAllEgressRulesOfGroup(group);
    this.moveSelectedGroupRight();
    this.resetSelectedGroup();
    this.resetSelectedColumn();
    this.emitChange();
  }

  public get rules(): Rules {
    return new Rules(this.securityGroups[SecurityGroupBuilderTemplates.Selected],
      this.checkedIngressRules,
      this.checkedEgressRules);
  }

  public onRulesChange(ruleItem: RuleListItem) {
    const findByRuleId = (_: RuleListItem) => _.rule.ruleId === ruleItem.rule.ruleId;
    const changedRule = this.selectedRules[ruleItem.type].find(findByRuleId);
    if (changedRule) {
      changedRule.checked = ruleItem.checked;
    }

    this.emitChange();
  }

  private emitChange(): void {
    this.onChange.emit(this.rules);
  };

  private get checkedIngressRules(): Array<NetworkRule> {
    return this.selectedRules[NetworkRuleTypes.Ingress]
      .filter(rule => rule.checked)
      .map(item => item.rule);
  }

  private get checkedEgressRules(): Array<NetworkRule> {
    return this.selectedRules[NetworkRuleTypes.Egress]
      .filter(rule => rule.checked)
      .map(item => item.rule);
  }

  private initRulesList(): void {
    if (!this.inputRules || !this.inputRules.templates.length) {
      return;
    }

    for (let i = 0; i < this.inputRules.templates.length; i++) {
      const ind = this.securityGroups[SecurityGroupBuilderTemplates.NotSelected]
        .findIndex(template => template.id === this.inputRules.templates[i].id);

      if (ind === -1) {
        continue;
      }

      this.securityGroups[SecurityGroupBuilderTemplates.Selected]
        .push(this.securityGroups[SecurityGroupBuilderTemplates.NotSelected][ind]);
      this.securityGroups[SecurityGroupBuilderTemplates.NotSelected].splice(ind, 1);
    }

    for (let i = 0; i < this.securityGroups[SecurityGroupBuilderTemplates.Selected].length; i++) {
      const group = this.securityGroups[SecurityGroupBuilderTemplates.Selected][i];
      for (let j = 0; j < group.ingressRules.length; j++) {
        const ind = this.inputRules.ingress.findIndex(rule => {
          return rule.ruleId === group.ingressRules[j].ruleId;
        });
        this.pushIngressRule(group.ingressRules[j], ind !== -1, NetworkRuleTypes.Ingress);
      }

      for (let j = 0; j < group.egressRules.length; j++) {
        const ind = this.inputRules.egress.findIndex(rule => {
          return rule.ruleId === group.egressRules[j].ruleId;
        });
        this.pushEgressRule(group.egressRules[j], ind !== -1, NetworkRuleTypes.Egress);
      }
    }
  }

  private pushAllIngressRulesOfGroup(group: SecurityGroup): void {
    group.ingressRules.forEach(rule => {
      this.pushIngressRule(rule, true, NetworkRuleTypes.Ingress);
    });
  }

  private pushAllEgressRulesOfGroup(group: SecurityGroup): void {
    group.egressRules.forEach(rule => {
      this.pushEgressRule(rule, true, NetworkRuleTypes.Egress);
    });
  }

  private pushIngressRule(rule, checked, type): void {
    this.selectedRules[NetworkRuleTypes.Ingress].push({
      rule,
      checked,
      type
    });
  }

  private pushEgressRule(rule, checked, type): void {
    this.selectedRules[NetworkRuleTypes.Egress].push({
      rule,
      checked,
      type
    });
  }

  private removeIngressRulesOfSelectedGroup(): void {
    const group = this.securityGroups[SecurityGroupBuilderTemplates.Selected][this.selectedGroupIndex];
    let startIndex = 0;

    for (let i = 0; i < this.selectedGroupIndex; i++) {
      startIndex += this.securityGroups[SecurityGroupBuilderTemplates.Selected][i].ingressRules.length;
    }

    this.selectedRules[NetworkRuleTypes.Ingress].splice(startIndex, group.ingressRules.length);
  }

  private removeEgressRulesOfSelectedGroup(): void {
    const group = this.securityGroups[SecurityGroupBuilderTemplates.Selected][this.selectedGroupIndex];
    let startIndex = 0;

    for (let i = 0; i < this.selectedGroupIndex; i++) {
      startIndex += this.securityGroups[SecurityGroupBuilderTemplates.Selected][i].egressRules.length;
    }

    this.selectedRules[NetworkRuleTypes.Egress].splice(startIndex, group.egressRules.length);
  }

  private resetSelectedGroup(): void {
    this.selectedGroupIndex = -1;
  }

  private resetSelectedColumn(): void {
    this.selectedColumnIndex = -1;
  }

  private moveSelectedGroupLeft(): void {
    this.securityGroups[SecurityGroupBuilderTemplates.NotSelected]
      .push(this.securityGroups[SecurityGroupBuilderTemplates.Selected][this.selectedGroupIndex]);
    this.securityGroups[SecurityGroupBuilderTemplates.Selected].splice(this.selectedGroupIndex, 1);
  }

  private moveSelectedGroupRight(): void {
    this.securityGroups[SecurityGroupBuilderTemplates.Selected]
      .push(this.securityGroups[SecurityGroupBuilderTemplates.NotSelected][this.selectedGroupIndex]);
    this.securityGroups[SecurityGroupBuilderTemplates.NotSelected].splice(this.selectedGroupIndex, 1);
  }
}
