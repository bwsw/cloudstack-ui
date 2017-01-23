import { Injectable } from '@angular/core';
import { ConfigService } from '../shared/config.service';
import { SecurityGroup, NetworkRule, NetworkRuleType } from './security-group.model';
import { BaseBackendService } from '../shared/services/base-backend.service';
import { BackendResource } from '../shared/decorators/backend-resource.decorator';
import { TagService } from '../shared/services/tag.service';
import { AsyncJobService } from '../shared/services/async-job.service';
import { Observable } from 'rxjs';


@Injectable()
@BackendResource({
  entity: 'SecurityGroup',
  entityModel: SecurityGroup
})
export class SecurityGroupService extends BaseBackendService<SecurityGroup> {
  constructor(
    private configService: ConfigService,
    private tagService: TagService,
    private asyncJobService: AsyncJobService
  ) {
    super();
  }

  public getTemplates(): Observable<Array<SecurityGroup>> {
    return this.configService.get('securityGroupTemplates')
      .map(groups => {
        for (let i = 0; i < groups.length; i++) {
          groups[i] = new SecurityGroup(groups[i]);
        }
        return groups;
      });
  }

  public createTemplate(data: any): Observable<any> {
    return this.create(data)
      .switchMap(res => {
        debugger;
        const id = res.id;
        const params = {
          resourceIds: id,
          resourceType: this.entity,
          'tags[0].key': 'template',
          'tags[0].value': 'true',
        };

        if (data.labels) {
          params['tags[1].key'] = 'labels';
          params['tags[1].value'] = data.labels;
        }
        const tagObservable = this.tagService.create(params)
          .switchMap(tagJob => {
            debugger;
            return this.asyncJobService.addJob(tagJob.jobid)
              .map(result => {
                debugger;
                let jobResult: any = {};
                if (result && result.jobResultCode === 0) {
                  jobResult.success = result.jobResult.success;
                  jobResult.tag = { key: 'labels', value: data.labels };
                } else {
                  jobResult.success = false;
                }
                result.jobResult = jobResult;
                this.asyncJobService.event.next(result);
                return result;
              });
          });
        return Observable.forkJoin([tagObservable]);
      });
  }

  public deleteTemplate(id: string) {
    return this.remove({ id });
  }

  public createWithRules(
    params: {},
    ingressRules: Array<NetworkRule>,
    egressRules: Array<NetworkRule>
  ): Observable<SecurityGroup> {
    return this.create(params)
      .map((securityGroup: SecurityGroup) => {
        const addRule = (type, rule) => {
          rule['securitygroupid'] = securityGroup.id;
          rule['cidrlist'] = rule.CIDR;
          rule.protocol = rule.protocol.toLowerCase();
          delete rule.CIDR;
          this.addRule(type, rule.serialize());
      };
      ingressRules.forEach(rule => addRule('Ingress', rule));
      egressRules.forEach(rule => addRule('Egress', rule));
      return securityGroup;
    });
  }

  public addRule(type: NetworkRuleType, data): Observable<NetworkRule> {
    const command = 'authorize';
    return this.postRequest(`${command};${type}`, data)
      .switchMap(res => {
        return this.asyncJobService.addJob(
          res[`${command}${this.entity.toLowerCase()}${type.toLowerCase()}response`].jobid
        ).map(jobResult => {
          if (jobResult.jobStatus === 2) {
            return Observable.throw(jobResult);
          }
          const ruleRaw = jobResult.jobResult.securitygroup[type.toLowerCase() + 'rule'][0];
          const rule = new NetworkRule(ruleRaw);
          return rule;
        });
      });
  }

  public removeRule(type: NetworkRuleType, data) {
    const command = 'revoke';
    return this.postRequest(`${command};${type}`, data)
      .map(res => {
        const response = res[`${command}${this.entity.toLowerCase()}${type.toLowerCase()}response`];
        const jobId = response.jobid;

        this.asyncJobService.addJob(jobId)
          .subscribe(jobResult => {
            if (jobResult.jobStatus === 2 || jobResult.jobResult && !jobResult.jobResult.success) {
              return Observable.throw(jobResult);
            }
            return Observable.of();
          });
      });
  }
}
