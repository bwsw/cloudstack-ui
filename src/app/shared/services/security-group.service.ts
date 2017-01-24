import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { SecurityGroup, NetworkRuleType } from '../../security-group/sg.model';
import { BaseBackendService } from './base-backend.service';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { TagService } from './tag.service';
import { AsyncJobService } from './async-job.service';
import { NetworkRule } from '../../security-group/sg.model';
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
    let template;
    return this.create(data)
      .switchMap(res => {
        template = res;

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

        return this.tagService.create(params);
      })
      .switchMap(tagJob => {
        return this.asyncJobService.addJob(tagJob.jobid);
      })
      .switchMap(result => {
        let jobResult: any = {};
        if (result && result.jobResultCode === 0) {
          jobResult.success = result.jobResult.success;
          jobResult.tag = { key: 'labels', value: data.labels };
        } else {
          jobResult.success = false;
        }
        result.jobResult = jobResult;
        this.asyncJobService.event.next(result);
        return Observable.forkJoin([
          Observable.of(template),
          Observable.of(result)
        ]);
      });
  }

  public deleteTemplate(id: string): Observable<any> {
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
        )})
      .switchMap(jobResult => {
        if (jobResult.jobStatus === 2) {
          return Observable.throw(jobResult);
        }
        const ruleRaw = jobResult.jobResult.securitygroup[type.toLowerCase() + 'rule'][0];
        const rule = new NetworkRule(ruleRaw);
        return Observable.of(rule);
      });
  }

  public removeRule(type: NetworkRuleType, data) {
    const command = 'revoke';
    return this.postRequest(`${command};${type}`, data)
      .switchMap(res => {
        const response = res[`${command}${this.entity.toLowerCase()}${type.toLowerCase()}response`];
        const jobId = response.jobid;
        return this.asyncJobService.addJob(jobId)
      })
      .switchMap(jobResult => {
        if (jobResult.jobStatus === 2 || jobResult.jobResult && !jobResult.jobResult.success) {
          return Observable.throw(jobResult);
        }
        return Observable.of(null);
      });
  }
}
