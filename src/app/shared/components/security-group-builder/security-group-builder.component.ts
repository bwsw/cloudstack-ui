import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NetworkRule } from '../../../security-group/network-rule.model';
import { SecurityGroupService } from '../../../security-group/services/security-group.service';
import {
  NetworkRuleType,
  SecurityGroup,
  SecurityGroupType
} from '../../../security-group/sg.model';
import { SecurityGroupTagKeys } from '../../services/tags/security-group-tag-keys';
import { Rules } from './rules';

export interface RuleListItem {
  rule: NetworkRule;
  checked: boolean;
  type: NetworkRuleType;
}

interface BuilderSecurityGroups {
  available: Array<SecurityGroup>,
  selected: Array<SecurityGroup>
}

interface BuilderNetworkRules {
  ingress: Array<RuleListItem>,
  egress: Array<RuleListItem>
}

@Component({
  selector: 'cs-security-group-builder',
  templateUrl: 'security-group-builder.component.html',
  styleUrls: ['security-group-builder.component.scss'],
})
export class SecurityGroupBuilderComponent implements OnInit {
  @Input() public inputRules: Rules;
  @Output() public onChange = new EventEmitter<Rules>();

  public securityGroups: BuilderSecurityGroups;
  public selectedGroupIndex: number;
  public selectedColumnIndex: number;
  public selectedRules: BuilderNetworkRules;

  public get NetworkRuleType() {
    return NetworkRuleType;
  }

  constructor(private securityGroupService: SecurityGroupService) {
    this.securityGroups = { available: [], selected: [] };
    this.selectedRules = { ingress: [], egress: [] };
  }

  public ngOnInit(): void {
    const templates = this.securityGroupService.getPredefinedTemplates();
    const accountSecurityGroups = this.securityGroupService.getList({
      'tags[0].key': SecurityGroupTagKeys.type,
      'tags[0].value': SecurityGroupType.CustomTemplate
    });

    accountSecurityGroups
      .subscribe(groups => {
        this.securityGroups.available = templates.concat(groups);

        this.initRulesList();
      });
  }

  public selectAll(): void {
    while (this.securityGroups.available.length) {
      this.selectedGroupIndex = 0;
      this.moveRight();
    }

    this.emitChange();
  }

  public reset(): void {
    while (this.securityGroups.selected.length) {
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

    const group = this.securityGroups.available[this.selectedGroupIndex];

    this.pushAllIngressRulesOfGroup(group);
    this.pushAllEgressRulesOfGroup(group);
    this.moveSelectedGroupRight();
    this.resetSelectedGroup();
    this.resetSelectedColumn();
    this.emitChange();
  }

  public get rules(): Rules {
    return new Rules(
      this.securityGroups.selected,
      this.checkedIngressRules,
      this.checkedEgressRules
    );
  }

  public onRulesChange(ruleItem: RuleListItem) {
    const findByRuleId = (_: RuleListItem) => _.rule.ruleId === ruleItem.rule.ruleId;
    const changedRule = this.selectedRules.ingress.find(findByRuleId)
      || this.selectedRules.egress.find(findByRuleId);
    if (changedRule) {
      changedRule.checked = ruleItem.checked;
    }

    this.emitChange();
  }

  private emitChange(): void {
    this.onChange.emit(this.rules);
  };

  private get checkedIngressRules(): Array<NetworkRule> {
    return this.selectedRules.ingress
      .filter(rule => rule.checked)
      .map(item => item.rule);
  }

  private get checkedEgressRules(): Array<NetworkRule> {
    return this.selectedRules.egress
      .filter(rule => rule.checked)
      .map(item => item.rule);
  }

  private initRulesList(): void {
    if (!this.inputRules || !this.inputRules.templates.length) {
      return;
    }

    for (let i = 0; i < this.inputRules.templates.length; i++) {
      const ind = this.securityGroups.available
        .findIndex(template => template.id === this.inputRules.templates[i].id);

      if (ind === -1) {
        continue;
      }

      this.securityGroups.selected
        .push(this.securityGroups.available[ind]);
      this.securityGroups.available.splice(ind, 1);
    }

    for (let i = 0; i < this.securityGroups.selected.length; i++) {
      const group = this.securityGroups.selected[i];
      for (let j = 0; j < group.ingressRules.length; j++) {
        const ind = this.inputRules.ingress.findIndex(rule => {
          return rule.ruleId === group.ingressRules[j].ruleId;
        });
        this.pushIngressRule(group.ingressRules[j], ind !== -1, NetworkRuleType.Ingress);
      }

      for (let j = 0; j < group.egressRules.length; j++) {
        const ind = this.inputRules.egress.findIndex(rule => {
          return rule.ruleId === group.egressRules[j].ruleId;
        });
        this.pushEgressRule(group.egressRules[j], ind !== -1, NetworkRuleType.Egress);
      }
    }
  }

  private pushAllIngressRulesOfGroup(group: SecurityGroup): void {
    group.ingressRules.forEach(rule => {
      this.pushIngressRule(rule, true, NetworkRuleType.Ingress);
    });
  }

  private pushAllEgressRulesOfGroup(group: SecurityGroup): void {
    group.egressRules.forEach(rule => {
      this.pushEgressRule(rule, true, NetworkRuleType.Egress);
    });
  }

  private pushIngressRule(rule, checked, type): void {
    this.selectedRules.ingress.push({
      rule,
      checked,
      type
    });
  }

  private pushEgressRule(rule, checked, type): void {
    this.selectedRules.egress.push({
      rule,
      checked,
      type
    });
  }

  private removeIngressRulesOfSelectedGroup(): void {
    const group = this.securityGroups.selected[this.selectedGroupIndex];
    let startIndex = 0;

    for (let i = 0; i < this.selectedGroupIndex; i++) {
      startIndex += this.securityGroups.selected[i].ingressRules.length;
    }

    this.selectedRules.ingress.splice(startIndex, group.ingressRules.length);
  }

  private removeEgressRulesOfSelectedGroup(): void {
    const group = this.securityGroups.selected[this.selectedGroupIndex];
    let startIndex = 0;

    for (let i = 0; i < this.selectedGroupIndex; i++) {
      startIndex += this.securityGroups.selected[i].egressRules.length;
    }

    this.selectedRules.egress.splice(startIndex, group.egressRules.length);
  }

  private resetSelectedGroup(): void {
    this.selectedGroupIndex = -1;
  }

  private resetSelectedColumn(): void {
    this.selectedColumnIndex = -1;
  }

  private moveSelectedGroupLeft(): void {
    this.securityGroups.available
      .push(this.securityGroups.selected[this.selectedGroupIndex]);
    this.securityGroups.selected.splice(this.selectedGroupIndex, 1);
  }

  private moveSelectedGroupRight(): void {
    this.securityGroups.selected
      .push(this.securityGroups.available[this.selectedGroupIndex]);
    this.securityGroups.available.splice(this.selectedGroupIndex, 1);
  }
}
