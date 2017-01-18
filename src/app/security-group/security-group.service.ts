import { Injectable } from '@angular/core';
import { ConfigService } from '../shared/config.service';
import { SecurityGroup, NetworkRule, NetworkRuleType } from './security-group.model';
import { BaseBackendService } from '../shared/services/base-backend.service';
import { BackendResource } from '../shared/decorators/backend-resource.decorator';
import { AsyncJobService } from '../shared/services/async-job.service';

@Injectable()
@BackendResource({
  entity: 'SecurityGroup',
  entityModel: SecurityGroup
})
export class SecurityGroupService extends BaseBackendService<SecurityGroup> {
  constructor(
    private configService: ConfigService,
    private asyncJobService: AsyncJobService
  ) {
    super();
  }

  public getTemplates(): Promise<Array<SecurityGroup>> {
    return this.configService.get('securityGroupTemplates')
      .then(groups => {
        for (let i = 0; i < groups.length; i++) {
          groups[i] = new SecurityGroup(groups[i]);
        }
        return groups;
      });
  }

  public addRule(type: NetworkRuleType, data) {
    const command = 'authorize';
    return new Promise((resolve, reject) => {
      this.postRequest(`${command};${type}`, data)
        .then(res => {
          const response = res[`${command}${this.entity.toLowerCase()}${type.toLowerCase()}response`];
          const jobId = response.jobid;

          this.asyncJobService.addJob(jobId)
            .subscribe(res => {
              if (res.jobStatus === 2) {
                reject(res);
                return;
              }
              const ruleRaw = res.jobResult.securitygroup[type.toLowerCase() + 'rule'][0];
              const rule = new NetworkRule(ruleRaw);
              resolve(rule);
            });
        })
    });
  }

  public removeRule(type: NetworkRuleType, data) {
    const command = 'revoke';
    return new Promise((resolve, reject) => {
      this.postRequest(`${command};${type}`, data)
        .then(res => {
          const response = res[`${command}${this.entity.toLowerCase()}${type.toLowerCase()}response`];
          const jobId = response.jobid;

          this.asyncJobService.addJob(jobId)
            .subscribe(res => {
              if (res.jobStatus === 2 || res.jobResult && !res.jobResult.success) {
                reject(res);
                return;
              }

              resolve();
            });
        })
    });
  }
}
