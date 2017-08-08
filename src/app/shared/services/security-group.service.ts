import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Rules } from '../../security-group/sg-creation/sg-creation.component';
import {
  NetworkProtocol,
  NetworkRule,
  NetworkRuleType,
  NetworkRuleTypes,
  SecurityGroup
} from '../../security-group/sg.model';
import { BackendResource } from '../decorators';
import { DeletionMark } from '../models';

import { TagService } from './tag.service';
import { BaseBackendCachedService } from './base-backend-cached.service';
import { AsyncJobService } from './async-job.service';
import { ConfigService } from './config.service';


export const GROUP_POSTFIX = '-cs-sg';

@Injectable()
@BackendResource({
  entity: 'SecurityGroup',
  entityModel: SecurityGroup
})
export class SecurityGroupService extends BaseBackendCachedService<SecurityGroup> {
  constructor(
    private asyncJobService: AsyncJobService,
    private configService: ConfigService,
    private tagService: TagService,
  ) {
    super();
  }

  public getTemplates(): Array<SecurityGroup> {
    return this.configService
      .get('securityGroupTemplates')
      .map(group => new SecurityGroup(group));
  }

  public createTemplate(data: any, rules?: Rules): Observable<any> {
    this.invalidateCache();
    let template;
    return (rules
      ? this.createWithRules(data, rules.ingress, rules.egress)
      : this.create(data))
      .switchMap(res => {
        template = res;

        const id = res.id;
        const params = {
          resourceIds: id,
          resourceType: this.entity,
          'tags[0].key': 'template',
          'tags[0].value': 'true'
        };

        return this.tagService.create(params);
      })
      .map(() => template);
  }

  public deleteTemplate(id: string): Observable<any> {
    this.invalidateCache();
    return this.remove({ id });
  }

  public createWithRules(
    params: {},
    ingressRules: Array<NetworkRule>,
    egressRules: Array<NetworkRule>
  ): Observable<SecurityGroup> {
    this.invalidateCache();
    ingressRules = this.removeDuplicateRules(ingressRules);
    egressRules = this.removeDuplicateRules(egressRules);

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
          r['securityGroupId'] = securityGroup.id;
          r['cidrList'] = r.CIDR;
          r.protocol = r.protocol.toLowerCase() as NetworkProtocol;
          delete r.CIDR;
          addRuleRequests.push(this.addRule(type, r.serialize()));
        };
        ingressRules.forEach(rule => addRule(NetworkRuleTypes.Ingress, rule));
        egressRules.forEach(rule => addRule(NetworkRuleTypes.Egress, rule));

        return Observable.forkJoin(addRuleRequests);
      })
      .map(() => {
        return sg;
      });
  }

  public addRule(type: NetworkRuleType, data): Observable<NetworkRule> {
    this.invalidateCache();
    const command = 'authorize';
    return this.sendCommand(`${command};${type}`, data)
      .switchMap(job => this.asyncJobService.queryJob(job.jobid, this.entity, this.entityModel))
      .switchMap(securityGroup => {
        const rule = securityGroup[`${type.toLowerCase()}Rules`][0];
        return Observable.of(rule);
      });
  }

  public markForDeletion(id: string): Observable<any> {
    return this.tagService.create({
      resourceIds: id,
      resourceType: this.entity,
      'tags[0].key': 'status',
      'tags[0].value': 'removed'
    });
  }

  public removeRule(type: NetworkRuleType, data): Observable<null> {
    this.invalidateCache();
    const command = 'revoke';
    return this.sendCommand(`${command};${type}`, data)
      .switchMap(job => this.asyncJobService.queryJob(job.jobid, this.entity, this.entityModel));
  }

  private removeDuplicateRules(rules: Array<NetworkRule>): Array<NetworkRule> {
    return rules.reduce((acc: Array<NetworkRule>, rule: NetworkRule) => {
      const unique = !acc.some(resultRule => rule.isEqual(resultRule));
      return unique ? acc.concat(rule) : acc;
    }, []);
  }
}
