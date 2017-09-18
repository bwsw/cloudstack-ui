import { Component, Inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../shared/services/notification.service';

import { SecurityGroupService } from '../../shared/services/security-group.service';
import {
  GetICMPCodeTranslationToken,
  GetICMPTypeTranslationToken,
  ICMPType,
  ICMPtypes
} from '../icmp-types';
import { NetworkProtocol, NetworkRuleType, SecurityGroup } from '../sg.model';


@Component({
  selector: 'cs-security-group-rules',
  templateUrl: 'sg-rules.component.html',
  styleUrls: ['sg-rules.component.scss']
})
export class SgRulesComponent {
  @ViewChild('rulesForm') public rulesForm: NgForm;
  public selectedType = '';
  public selectedCode = '';

  public type: NetworkRuleType;
  public protocol: NetworkProtocol;
  public startPort: number;
  public icmpType: number;
  public icmpTypes: ICMPType[] = ICMPtypes;
  public icmpCode: number;
  public icmpCodes: number[];
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
        }
      );
  }

  public getIcmpTypeTranslationToken(type: number): string {
    return GetICMPTypeTranslationToken(type);
  }

  public getIcmpCodeTranslationToken(type: number, code: number): string {
    return GetICMPCodeTranslationToken(type, code);
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
        .indexOf(filterValue) !== -1) : ICMPtypes.find(x => x.type === this.icmpType).codes;
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
