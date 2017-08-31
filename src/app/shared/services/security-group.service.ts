import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Rules } from '../../security-group/sg-creation/sg-creation.component';
import { NetworkRuleType, SecurityGroup } from '../../security-group/sg.model';
import { BackendResource } from '../decorators';
import { AsyncJobService } from './async-job.service';
import { BaseBackendCachedService } from './base-backend-cached.service';
import { ConfigService } from './config.service';
import { SecurityGroupTagService } from './tags/security-group-tag.service';
import { NetworkProtocol, NetworkRule } from '../../security-group/network-rule.model';
import { Subject } from 'rxjs/Subject';


export const GROUP_POSTFIX = '-cs-sg';

@Injectable()
@BackendResource({
  entity: 'SecurityGroup',
  entityModel: SecurityGroup
})
export class SecurityGroupService extends BaseBackendCachedService<SecurityGroup> {
  public onSecurityGroupDeleted = new Subject<SecurityGroup>();

  constructor(
    private asyncJobService: AsyncJobService,
    private configService: ConfigService,
    private securityGroupTagService: SecurityGroupTagService
  ) {
    super();
  }

  public getTemplates(): Array<SecurityGroup> {
    return this.configService
      .get('securityGroupTemplates')
      .map(group => new SecurityGroup(group));
  }

  public createTemplate(data: any, rules?: Rules): Observable<SecurityGroup> {
    this.invalidateCache();
    const ingressRules = rules && rules.ingress || [];
    const egressRules = rules && rules.egress || [];

    return this.createWithRules(data, ingressRules, egressRules)
      .switchMap(template => this.securityGroupTagService.markAsTemplate(template));
  }

  public deleteTemplate(securityGroup: SecurityGroup): Observable<any> {
    this.invalidateCache();
    return this.remove({ id: securityGroup.id })
      .map(result => {
        if (result && result.success === 'true') {
          this.onSecurityGroupDeleted.next(securityGroup);
        } else {
          return Observable.throw(result);
        }
      });
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
        ingressRules.forEach(rule => addRule(NetworkRuleType.Ingress, rule));
        egressRules.forEach(rule => addRule(NetworkRuleType.Egress, rule));

        return Observable.forkJoin(addRuleRequests);
      })
      .map(() => sg);
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

  public markForRemoval(securityGroup: SecurityGroup): Observable<any> {
    return this.securityGroupTagService.markForRemoval(securityGroup);
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
