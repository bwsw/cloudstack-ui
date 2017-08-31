import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NetworkRule } from '../../../security-group/network-rule.model';
import { NetworkRuleType, SecurityGroup } from '../../../security-group/sg.model';
import { BackendResource } from '../../decorators/backend-resource.decorator';
import { BaseBackendCachedService } from '../base-backend-cached.service';
import { AsyncJobService } from '../async-job.service';


@Injectable()
@BackendResource({
  entity: 'SecurityGroup',
  entityModel: SecurityGroup
})
export class NetworkRuleService extends BaseBackendCachedService<SecurityGroup> {
  constructor(private asyncJobService: AsyncJobService) {
    super();
  }

  public addRule(type: NetworkRuleType, data): Observable<NetworkRule> {
    const command = 'authorize';
    return this.sendCommand(`${command};${type}`, data)
      .switchMap(job => this.asyncJobService.queryJob(job.jobid, this.entity, this.entityModel))
      .switchMap(securityGroup => {
        const rule = securityGroup[`${type.toLowerCase()}Rules`][0];
        return Observable.of(rule);
      });
  }

  public removeRule(type: NetworkRuleType, data): Observable<null> {
    this.invalidateCache();
    const command = 'revoke';
    return this.sendCommand(`${command};${type}`, data)
      .switchMap(job => this.asyncJobService.queryJob(job.jobid, this.entity, this.entityModel));
  }

  public removeDuplicateRules(rules: Array<NetworkRule>): Array<NetworkRule> {
    return rules.reduce((acc: Array<NetworkRule>, rule: NetworkRule) => {
      const unique = !acc.some(resultRule => rule.isEqual(resultRule));
      return unique ? acc.concat(rule) : acc;
    }, []);
  }
}
