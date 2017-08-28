import { Component, Inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { SecurityGroupService } from '../../shared/services/security-group.service';
import { SecurityGroup, NetworkRuleType, NetworkProtocol } from '../sg.model';
import { NotificationService } from '../../shared/services/notification.service';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';


@Component({
  selector: 'cs-security-group-rules',
  templateUrl: 'sg-rules.component.html',
  styleUrls: ['sg-rules.component.scss']
})
export class SgRulesComponent {
  @ViewChild('rulesForm') public rulesForm: NgForm;

  public type: NetworkRuleType;
  public protocol: NetworkProtocol;
  public startPort: number;
  public icmpType: number;
  public icmpCode: number;
  public endPort: number;
  public cidr: string;
  public securityGroup: SecurityGroup;

  public adding: boolean;

  public NetworkProtocols = NetworkProtocol;
  public NetworkRuleTypes = NetworkRuleType;

  public types = [
    { value: NetworkRuleType.Ingress, text: 'SECURITY_GROUP_PAGE.RULES.INGRESS' },
    { value: NetworkRuleType.Egress, text: 'SECURITY_GROUP_PAGE.RULES.EGRESS' },
  ];

  public protocols = [
    { value: NetworkProtocol.TCP, text: 'SECURITY_GROUP_PAGE.RULES.TCP' },
    { value: NetworkProtocol.UDP, text: 'SECURITY_GROUP_PAGE.RULES.UDP' },
    { value: NetworkProtocol.ICMP, text: 'SECURITY_GROUP_PAGE.RULES.ICMP' }
  ];

  constructor(
    public dialogRef: MdDialogRef<SgRulesComponent>,
    @Inject(MD_DIALOG_DATA) data,
    private securityGroupService: SecurityGroupService,
    private notificationService: NotificationService,
    private translateService: TranslateService
  ) {
    this.securityGroup = data.securityGroup;
    this.cidr = '0.0.0.0/0';
    this.protocol = NetworkProtocol.TCP;
    this.type = NetworkRuleType.Ingress;
    this.icmpCode = -1;
    this.icmpType = -1;

    this.adding = false;
  }

  public get title(): string {
    if (this.securityGroup.isPredefinedTemplate) {
      return 'SECURITY_GROUP_PAGE.RULES.TEMPLATE_RULES';
    }

    return 'SECURITY_GROUP_PAGE.RULES.FIREWALL_RULES_FOR_VM';
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

    this.securityGroupService.addRule(type, params)
      .subscribe(
        rule => {
          this.securityGroup[`${type.toLowerCase()}Rules`].push(rule);
          this.resetForm();
          this.adding = false;
        },
        () => {
          this.notificationService.message('SECURITY_GROUP_PAGE.RULES.FAILED_TO_ADD_RULE');
          this.adding = false;
        });
  }

  public onIcmpTypeClick(): void {
    if (!this.icmpType) {
      this.icmpType = -1;
    }
  }

  public onIcmpCodeClick(): void {
    if (!this.icmpCode) {
      this.icmpCode = -1;
    }
  }

  public onCidrClick(): void {
    if (!this.cidr) {
      this.cidr = '0.0.0.0/0';
    }
  }

  public removeRule({ type, id }): void {
    this.securityGroupService.removeRule(type, { id })
      .subscribe(() => {
        const rules = this.securityGroup[`${type.toLowerCase()}Rules`];
        const ind = rules.findIndex(rule => rule.ruleId === id);
        if (ind === -1) {
          return;
        }
        rules.splice(ind, 1);
      }, () => {
        this.translateService.get(['SECURITY_GROUP_PAGE.RULES.FAILED_TO_REMOVE_RULE'])
          .subscribe((translations) => {
            this.notificationService.message(translations['SECURITY_GROUP_PAGE.RULES.FAILED_TO_REMOVE_RULE']);
          });
      });
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
}
