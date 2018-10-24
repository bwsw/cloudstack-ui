import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { withLatestFrom } from 'rxjs/operators';

import { NetworkRule } from '../../../security-group/network-rule.model';
import { SecurityGroupService } from '../../../security-group/services/security-group.service';
import {
  NetworkRuleType,
  SecurityGroup,
  SecurityGroupType,
} from '../../../security-group/sg.model';
import { securityGroupTagKeys } from '../../services/tags/security-group-tag-keys';
import { Rules } from './rules';
import { configSelectors, State } from '../../../root-store';

export interface RuleListItem {
  rule: NetworkRule;
  checked: boolean;
  type: NetworkRuleType;
}

interface BuilderSecurityGroups {
  available: SecurityGroup[];
  selected: SecurityGroup[];
}

interface BuilderNetworkRules {
  ingress: RuleListItem[];
  egress: RuleListItem[];
}

@Component({
  selector: 'cs-security-group-builder',
  templateUrl: 'security-group-builder.component.html',
  styleUrls: ['security-group-builder.component.scss'],
})
export class SecurityGroupBuilderComponent implements OnInit {
  @Input()
  public inputRules: Rules;
  @Output()
  public changed = new EventEmitter<Rules>();

  public securityGroups: BuilderSecurityGroups;
  public selectedGroupIndex: number;
  public selectedColumnIndex: number;
  public selectedRules: BuilderNetworkRules;

  public get NetworkRuleType() {
    return NetworkRuleType;
  }

  constructor(private securityGroupService: SecurityGroupService, private store: Store<State>) {
    this.securityGroups = { available: [], selected: [] };
    this.selectedRules = { ingress: [], egress: [] };
  }

  public ngOnInit(): void {
    const accountSecurityGroups = this.securityGroupService.getList({
      'tags[0].key': securityGroupTagKeys.type,
      'tags[0].value': SecurityGroupType.CustomTemplate,
    });

    accountSecurityGroups
      .pipe(withLatestFrom(this.store.pipe(select(configSelectors.get('securityGroupTemplates')))))
      .subscribe(([groups, templates]) => {
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
      this.checkedEgressRules,
    );
  }

  public onRulesChange(ruleItem: RuleListItem) {
    const findByRuleId = (_: RuleListItem) => _.rule.ruleid === ruleItem.rule.ruleid;
    const changedRule =
      this.selectedRules.ingress.find(findByRuleId) || this.selectedRules.egress.find(findByRuleId);
    if (changedRule) {
      changedRule.checked = ruleItem.checked;
    }

    this.emitChange();
  }

  private emitChange(): void {
    this.changed.emit(this.rules);
  }

  private get checkedIngressRules(): NetworkRule[] {
    return this.selectedRules.ingress.filter(rule => rule.checked).map(item => item.rule);
  }

  private get checkedEgressRules(): NetworkRule[] {
    return this.selectedRules.egress.filter(rule => rule.checked).map(item => item.rule);
  }

  private initRulesList(): void {
    if (!this.inputRules || !this.inputRules.templates.length) {
      return;
    }

    for (const template of this.inputRules.templates) {
      const ind = this.securityGroups.available.findIndex(t => t.id === template.id);

      if (ind === -1) {
        continue;
      }

      this.securityGroups.selected.push(this.securityGroups.available[ind]);
      this.securityGroups.available.splice(ind, 1);
    }

    for (const selectedSecurityGroup of this.securityGroups.selected) {
      for (const ingressRule of selectedSecurityGroup.ingressrule) {
        const ind = this.inputRules.ingress.findIndex(rule => {
          return rule.ruleid === ingressRule.ruleid;
        });
        this.pushIngressRule(ingressRule, ind !== -1, NetworkRuleType.Ingress);
      }

      for (const egressRule of selectedSecurityGroup.egressrule) {
        const ind = this.inputRules.egress.findIndex(rule => {
          return rule.ruleid === egressRule.ruleid;
        });
        this.pushEgressRule(egressRule, ind !== -1, NetworkRuleType.Egress);
      }
    }
  }

  private pushAllIngressRulesOfGroup(group: SecurityGroup): void {
    group.ingressrule.forEach(rule => {
      this.pushIngressRule(rule, true, NetworkRuleType.Ingress);
    });
  }

  private pushAllEgressRulesOfGroup(group: SecurityGroup): void {
    group.egressrule.forEach(rule => {
      this.pushEgressRule(rule, true, NetworkRuleType.Egress);
    });
  }

  private pushIngressRule(rule: NetworkRule, checked: boolean, type: NetworkRuleType): void {
    this.selectedRules.ingress.push({
      rule,
      checked,
      type,
    });
  }

  private pushEgressRule(rule: NetworkRule, checked: boolean, type: NetworkRuleType): void {
    this.selectedRules.egress.push({
      rule,
      checked,
      type,
    });
  }

  private removeIngressRulesOfSelectedGroup(): void {
    const group = this.securityGroups.selected[this.selectedGroupIndex];
    let startIndex = 0;

    for (let i = 0; i < this.selectedGroupIndex; i += 1) {
      startIndex += this.securityGroups.selected[i].ingressrule.length;
    }

    this.selectedRules.ingress.splice(startIndex, group.ingressrule.length);
  }

  private removeEgressRulesOfSelectedGroup(): void {
    const group = this.securityGroups.selected[this.selectedGroupIndex];
    let startIndex = 0;

    for (let i = 0; i < this.selectedGroupIndex; i += 1) {
      startIndex += this.securityGroups.selected[i].egressrule.length;
    }

    this.selectedRules.egress.splice(startIndex, group.egressrule.length);
  }

  private resetSelectedGroup(): void {
    this.selectedGroupIndex = -1;
  }

  private resetSelectedColumn(): void {
    this.selectedColumnIndex = -1;
  }

  private moveSelectedGroupLeft(): void {
    this.securityGroups.available.push(this.securityGroups.selected[this.selectedGroupIndex]);
    this.securityGroups.selected.splice(this.selectedGroupIndex, 1);
  }

  private moveSelectedGroupRight(): void {
    this.securityGroups.selected.push(this.securityGroups.available[this.selectedGroupIndex]);
    this.securityGroups.available.splice(this.selectedGroupIndex, 1);
  }
}
