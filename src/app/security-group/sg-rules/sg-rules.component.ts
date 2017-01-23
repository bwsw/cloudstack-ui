import { Component, Inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MdlDialogReference } from 'angular2-mdl';
import { TranslateService } from 'ng2-translate';

import { SecurityGroupService } from '../../shared/services';
import { SecurityGroup, NetworkRuleType } from '../sg.model';
import { NotificationService } from '../../shared/services';

@Component({
  selector: 'cs-security-group-rules',
  templateUrl: 'sg-rules.component.html',
  styleUrls: ['sg-rules.component.scss']
})
export class SgRulesComponent {
  @ViewChild('rulesForm') public rulesForm: NgForm;
  public type: NetworkRuleType;
  public protocol: 'TCP'|'UDP'|'ICMP';
  public startPort: number;
  public icmpType: number;
  public icmpCode: number;
  public endPort: number;
  public cidr: string;

  public adding: boolean;

  constructor(
    public dialog: MdlDialogReference,
    private securityGroupService: SecurityGroupService,
    private notificationService: NotificationService,
    @Inject('securityGroup') public securityGroup: SecurityGroup,
    private translateService: TranslateService
  ) {
    this.protocol = 'TCP';
    this.type = 'Ingress';
    this.adding = false;
  }

  public addRule() {
    const type = this.type;
    const params: any = {
      securitygroupid: this.securityGroup.id,
      protocol: this.protocol.toLowerCase(),
      cidrlist: this.cidr
    };

    if (this.protocol === 'ICMP') {
      params.icmptype = this.icmpType;
      params.icmpcode = this.icmpCode;
    } else {
      params.startport = this.startPort;
      params.endport = this.endPort;
    }

    this.adding = true;

    this.securityGroupService.addRule(type, params)
      .then(rule => {
        this.securityGroup[`${type.toLowerCase()}Rules`].push(rule);
        this.cidr = '';
        this.startPort = this.endPort = this.icmpCode = this.icmpType = null;
        this.rulesForm.form.reset();
      })
      .catch(() => {
        this.translateService.get(['FAILED_TO_ADD_RULE']).subscribe((translations) => {
          this.notificationService.message(translations['FAILED_TO_ADD_RULE']);
        });
      })
      .then(() => this.adding = false);
  }

  public removeRule({ type, id }) {
    this.securityGroupService.removeRule(type, { id })
      .then(() => {
        const rules = this.securityGroup[`${type.toLowerCase()}Rules`];
        const ind = rules.findIndex(rule => rule.ruleId === id);
        if (ind === -1) {
          return;
        }

        rules.splice(ind, 1);
      })
      .catch(() => {
        this.translateService.get(['FAILED_TO_REMOVE_RULE']).subscribe((translations) => {
          this.notificationService.message(translations['FAILED_TO_REMOVE_RULE']);
        });
      });
  }
}
