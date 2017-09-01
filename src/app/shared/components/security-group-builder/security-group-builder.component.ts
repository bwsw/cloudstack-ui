import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { SecurityGroupService } from '../../../security-group/services/security-group.service';
import { SecurityGroupTagKeys } from '../../services/tags/security-group-tag-keys';
import { NetworkRuleType, SecurityGroup, SecurityGroupType } from '../../../security-group/sg.model';
import { NetworkRule } from '../../../security-group/network-rule.model';


export interface RuleListItem {
  rule: NetworkRule;
  checked: boolean;
}

export class Rules { // defines what should be passed to inputRules
  public static createWithAllRulesSelected(securityGroups: Array<SecurityGroup>): Rules {
    const ingress = securityGroups.reduce((acc, securityGroup) => acc.concat(securityGroup.ingressRules), []);
    const egress = securityGroups.reduce((acc, securityGroup) => acc.concat(securityGroup.egressRules), []);

    return new Rules(securityGroups, ingress, egress);
  }

  constructor(
    public templates?: Array<SecurityGroup>,
    public ingress?: Array<NetworkRule>,
    public egress?: Array<NetworkRule>
  ) {
    this.ingress = ingress || [];
    this.egress = egress || [];
    this.templates = templates || [];
  }
}

@Component({
  selector: 'cs-security-group-builder',
  templateUrl: 'security-group-builder.component.html',
  styleUrls: ['security-group-builder.component.scss'],
})
export class SecurityGroupBuilderComponent implements OnInit {
  public items: Array<Array<SecurityGroup>>;
  public selectedGroupIndex: number;
  public selectedColumnIndex: number;
  public selectedRules: Array<Array<RuleListItem>>;

  public NetworkRuleTypes = NetworkRuleType;

  constructor(
    private dialogRef: MdDialogRef<SecurityGroupBuilderComponent>,
    private securityGroupService: SecurityGroupService,
    @Inject(MD_DIALOG_DATA) private inputRules: Rules
  ) {
    this.items = [[], []];
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
        this.items[0] = templates.concat(groups);

        this.initRulesList();
      });
  }

  public selectAll(): void {
    while (this.items[0].length) {
      this.selectedGroupIndex = 0;
      this.moveRight();
    }
  }

  public reset(): void {
    while (this.items[1].length) {
      this.selectedGroupIndex = 0;
      this.moveLeft();
    }
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
  }

  public moveRight(): void {
    if (this.selectedGroupIndex === -1) {
      return;
    }

    const group = this.items[0][this.selectedGroupIndex];

    this.pushAllIngressRulesOfGroup(group);
    this.pushAllEgressRulesOfGroup(group);
    this.moveSelectedGroupRight();
    this.resetSelectedGroup();
    this.resetSelectedColumn();
  }

  public onSave(): void {
    this.dialogRef.close({
      templates: this.items[1],
      ingress: this.selectedRules[0].filter(rule => rule.checked).map(item => item.rule),
      egress: this.selectedRules[1].filter(rule => rule.checked).map(item => item.rule),
    });
  }

  public onCancel(): void {
    this.dialogRef.close(this.inputRules);
  }

  private initRulesList(): void {
    if (!this.inputRules || !this.inputRules.templates.length) {
      return;
    }

    for (let i = 0; i < this.inputRules.templates.length; i++) {
      const ind = this.items[0].findIndex(template => template.id === this.inputRules.templates[i].id);

      if (ind === -1) {
        continue;
      }

      this.items[1].push(this.items[0][ind]);
      this.items[0].splice(ind, 1);
    }

    for (let i = 0; i < this.items[1].length; i++) {
      const group = this.items[1][i];
      for (let j = 0; j < group.ingressRules.length; j++) {
        const ind = this.inputRules.ingress.findIndex(rule => {
          return rule.ruleId === group.ingressRules[j].ruleId;
        });
        this.pushIngressRule(group.ingressRules[j], ind !== -1);
      }

      for (let j = 0; j < group.egressRules.length; j++) {
        const ind = this.inputRules.egress.findIndex(rule => {
          return rule.ruleId === group.egressRules[j].ruleId;
        });
        this.pushEgressRule(group.egressRules[j], ind !== -1);
      }
    }
  }

  private pushAllIngressRulesOfGroup(group: SecurityGroup): void {
    group.ingressRules.forEach(rule => {
      this.pushIngressRule(rule, true);
    });
  }

  private pushAllEgressRulesOfGroup(group: SecurityGroup): void {
    group.egressRules.forEach(rule => {
      this.pushEgressRule(rule, true);
    });
  }

  private pushIngressRule(rule, checked): void {
    this.selectedRules[0].push({
      rule,
      checked
    });
  }

  private pushEgressRule(rule, checked): void {
    this.selectedRules[1].push({
      rule,
      checked
    });
  }

  private removeIngressRulesOfSelectedGroup(): void {
    const group = this.items[1][this.selectedGroupIndex];
    let startIndex = 0;

    for (let i = 0; i < this.selectedGroupIndex; i++) {
      startIndex += this.items[1][i].ingressRules.length;
    }

    this.selectedRules[0].splice(startIndex, group.ingressRules.length);
  }

  private removeEgressRulesOfSelectedGroup(): void {
    const group = this.items[1][this.selectedGroupIndex];
    let startIndex = 0;

    for (let i = 0; i < this.selectedGroupIndex; i++) {
      startIndex += this.items[1][i].egressRules.length;
    }

    this.selectedRules[1].splice(startIndex, group.egressRules.length);
  }

  private resetSelectedGroup(): void {
    this.selectedGroupIndex = -1;
  }

  private resetSelectedColumn(): void {
    this.selectedColumnIndex = -1;
  }

  private moveSelectedGroupLeft(): void {
    this.items[0].push(this.items[1][this.selectedGroupIndex]);
    this.items[1].splice(this.selectedGroupIndex, 1);
  }

  private moveSelectedGroupRight(): void {
    this.items[1].push(this.items[0][this.selectedGroupIndex]);
    this.items[0].splice(this.selectedGroupIndex, 1);
  }
}
