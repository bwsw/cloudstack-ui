import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ConfigService } from './config.service';
import { SecurityGroup, NetworkRuleType } from '../../security-group/sg.model';
import { BaseBackendCachedService } from '.';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { TagService } from './tag.service';
import { AsyncJobService } from './async-job.service';
import { NetworkRule } from '../../security-group/sg.model';

export const GROUP_POSTFIX = '-cs-sg';

@Injectable()
@BackendResource({
  entity: 'SecurityGroup',
  entityModel: SecurityGroup
})
export class SecurityGroupService extends BaseBackendCachedService<SecurityGroup> {
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
    this.invalidateCache();
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

        if (!result || !result.jobResult.success) {
          return Observable.throw(result.jobResult);
        }
        template.labels = [result.jobResult.tag.value];

        return Observable.of(template);
      });
  }

  public deleteTemplate(id: string): Observable<any> {
    this.invalidateCache();
    return this.remove({ id });
  }

  public removeEmptyGroups(): void {
    this.invalidateCache();
    this.getList()
      .subscribe((groups: Array<SecurityGroup>) => {
        const uuidV4RegexRaw = '[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}';
        const regex = new RegExp(`^${uuidV4RegexRaw}${GROUP_POSTFIX}$`, 'i');
        groups.forEach(group => {
          if (!regex.test(group.name)) {
            return;
          }

          if (group.virtualMachineIds.length) {
            return;
          }

          this.remove({ id: group.id }).toPromise();
        });
      });
  }

  public createWithRules(
    params: {},
    ingressRules: Array<NetworkRule>,
    egressRules: Array<NetworkRule>
  ): Observable<SecurityGroup> {
    this.invalidateCache();
    let sg: SecurityGroup;
    return this.create(params)
      .switchMap((securityGroup: SecurityGroup) => {
        sg = securityGroup;

        if (!ingressRules.length && !egressRules.length) {
          return Observable.of(null);
        }
        const addRuleRequests = [];
        const addRule = (type, rule) => {
          const r = new NetworkRule(Object.assign({}, rule));
          r['securitygroupid'] = securityGroup.id;
          r['cidrlist'] = r.CIDR;
          r.protocol = r.protocol.toLowerCase();
          delete r.CIDR;
          addRuleRequests.push(this.addRule(type, r.serialize()));
        };
        ingressRules.forEach(rule => addRule('Ingress', rule));
        egressRules.forEach(rule => addRule('Egress', rule));

        return Observable.forkJoin(addRuleRequests);
      })
      .map(() => {
        return sg;
      });
  }

  public addRule(type: NetworkRuleType, data): Observable<NetworkRule> {
    this.invalidateCache();
    const command = 'authorize';
    return this.postRequest(`${command};${type}`, data)
      .switchMap(res => {
        return this.asyncJobService.addJob(
          res[`${command}${this.entity.toLowerCase()}${type.toLowerCase()}response`].jobid
        );
      })
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
    this.invalidateCache();
    const command = 'revoke';
    return this.postRequest(`${command};${type}`, data)
      .switchMap(res => {
        const response = res[`${command}${this.entity.toLowerCase()}${type.toLowerCase()}response`];
        const jobId = response.jobid;
        return this.asyncJobService.addJob(jobId);
      })
      .switchMap(jobResult => {
        if (jobResult.jobStatus === 2 || jobResult.jobResult && !jobResult.jobResult.success) {
          return Observable.throw(jobResult);
        }
        return Observable.of(null);
      });
  }
}
