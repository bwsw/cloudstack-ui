import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { NetworkRule } from '../network-rule.model';
import { NetworkRuleType, SecurityGroup } from '../sg.model';
import { BackendResource } from '../../shared/decorators/backend-resource.decorator';
import { BaseBackendCachedService } from '../../shared/services/base-backend-cached.service';
import { AsyncJobService } from '../../shared/services/async-job.service';

@Injectable()
@BackendResource({
  entity: 'SecurityGroup',
})
export class NetworkRuleService extends BaseBackendCachedService<SecurityGroup> {
  constructor(private asyncJobService: AsyncJobService, protected http: HttpClient) {
    super(http);
  }

  public addRule(type: NetworkRuleType, data): Observable<NetworkRule> {
    const command = 'authorize';
    return this.sendCommand(`${command};${type}`, data).pipe(
      switchMap(job => this.asyncJobService.queryJob(job.jobid, this.entity)),
      map(securityGroup => {
        return securityGroup[`${type.toLowerCase()}rule`][0];
      }),
    );
  }

  public removeRule(type: NetworkRuleType, data): Observable<null> {
    this.invalidateCache();
    const command = 'revoke';
    return this.sendCommand(`${command};${type}`, data).pipe(
      switchMap(job => this.asyncJobService.queryJob(job.jobid, this.entity)),
    );
  }

  public removeDuplicateRules(rules: NetworkRule[]): NetworkRule[] {
    return rules.reduce((acc: NetworkRule[], rule: NetworkRule) => {
      const unique = !acc.some(resultRule => rule.ruleid === resultRule.ruleid);
      return unique ? acc.concat(rule) : acc;
    }, []);
  }
}
