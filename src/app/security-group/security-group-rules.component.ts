import { Component, Inject } from '@angular/core';
import { SecurityGroupService } from './security-group.service';
import { SecurityGroup, NetworkRule } from './security-group.model';
import { AsyncJobService } from '../shared/services/async-job.service';
import { MdlDialogReference } from 'angular2-mdl';

@Component({
  selector: 'cs-security-group-rules',
  templateUrl: './security-group-rules.component.html',
  styleUrls: ['./security-group-rules.component.scss']
})
export class SecurityGroupRulesComponent {
  public type: 'Ingress'|'Egress';
  public protocol: 'TCP'|'UDP'|'ICMP';
  public startPort: number; // TODO validation
  public icmpType: number;
  public icmpCode: number;
  public endPort: number;
  public cidr: string;

  constructor(
    private dialog: MdlDialogReference,
    private securityGroupService: SecurityGroupService,
    private asyncJobService: AsyncJobService,
    @Inject('securityGroup') public securityGroup: SecurityGroup
  ) {
    this.protocol = 'TCP';
    this.type = 'Ingress';
  }

  public onHide() {
    this.dialog.hide();
  }

  public addRule() {
    const type = this.type;
    const params: any = {
      securitygroupid: this.securityGroup.id,
      protocol: this.protocol.toLowerCase(),
      cidrlist: this.cidr
    };

    if (this.protocol === 'TCP' || this.protocol === 'UDP') {
      params.startport = this.startPort;
      params.endport = this.endPort;
    } else {
      params.icmptype = this.icmpType;
      params.icmpcode = this.icmpCode;
    }
    this.securityGroupService.addRule(type, params)
      .then(jobId => {
        this.asyncJobService.addJob(jobId)
          .filter(result => result && result.jobResultCode === 0)
          .map(result => {
            this.asyncJobService.event.next(result);
            return result;
          })
          .subscribe(res => {
            const jobResult = res.jobResult;

            const ruleRaw = jobResult.securitygroup[type.toLowerCase() + 'rule'][0];
            const rule = new NetworkRule(ruleRaw);
            this.securityGroup[`${type.toLowerCase()}Rules`].push(rule);
          });
      });

  }

  public removeRule(type, id) {
    this.securityGroupService.removeRule(type, { id })
      .then(jobId => {
        this.asyncJobService.addJob(jobId)
          .filter(result => result && result.jobResultCode === 0)
          .map(result => {
            this.asyncJobService.event.next(result);
            return result;
          })
          .subscribe(res => {
            if (!res.jobResult.success) {
              return; // TODO error handling
            }

            const rules = this.securityGroup[`${type.toLowerCase()}Rules`];
            const ind = rules.findIndex(rule => {
              return rule.ruleId === id;
            });

            if (ind === -1) {
              return;
            }

            rules.splice(ind, 1);
          });
      });
  }
}
