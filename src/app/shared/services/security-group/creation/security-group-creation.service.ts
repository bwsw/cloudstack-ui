import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NetworkProtocol, NetworkRule } from '../../../../security-group/network-rule.model';
import { Rules } from '../../../../security-group/sg-creation/sg-creation.component';
import { NetworkRuleType, SecurityGroup } from '../../../../security-group/sg.model';
import { BaseBackendService } from '../../base-backend.service';
import { SecurityGroupTagService } from '../../tags/security-group-tag.service';
import { NetworkRuleService } from '../network-rule.service';


@Injectable()
export class SecurityGroupCreationService extends BaseBackendService<SecurityGroup> {
  constructor(
    protected securityGroupTagService: SecurityGroupTagService,
    private networkRuleService: NetworkRuleService
  ) {
    super();
  }

  public createTemplate(data: any, rules?: Rules): Observable<SecurityGroup> {
    const ingressRules = rules && rules.ingress || [];
    const egressRules = rules && rules.egress || [];

    return this.createWithRules(data, ingressRules, egressRules)
      .switchMap(template => this.securityGroupCreationPostAction(template));
  }

  protected securityGroupCreationPostAction(securityGroup: SecurityGroup): Observable<any> {
    return Observable.of(null);
  }

  private createWithRules(
    params: {},
    ingressRulesWithPossibleDuplicates: Array<NetworkRule>,
    egressRulesWithPossibleDuplicates: Array<NetworkRule>
  ): Observable<SecurityGroup> {
    const ingressRules = this.networkRuleService.removeDuplicateRules(ingressRulesWithPossibleDuplicates);
    const egressRules = this.networkRuleService.removeDuplicateRules(egressRulesWithPossibleDuplicates);

    return this.create(params).switchMap(securityGroup => {
      return this.authorizeRules(securityGroup, ingressRules, egressRules);
    });
  }

  private authorizeRules(
    securityGroup: SecurityGroup,
    ingressRules: Array<NetworkRule>,
    egressRules: Array<NetworkRule>
  ): Observable<SecurityGroup> {

    if (!ingressRules.length && !egressRules.length) {
      return Observable.of(securityGroup);
    }

    const addRuleRequests = [];
    const addRule = (type: NetworkRuleType, rule: NetworkRule) => {
      const r = new NetworkRule(Object.assign({}, rule));
      r['securityGroupId'] = securityGroup.id;
      r['cidrList'] = r.CIDR;
      r.protocol = r.protocol.toLowerCase() as NetworkProtocol;
      delete r.CIDR;
      addRuleRequests.push(this.networkRuleService.addRule(type, r.serialize()));
    };
    ingressRules.forEach(rule => addRule(NetworkRuleType.Ingress, rule));
    egressRules.forEach(rule => addRule(NetworkRuleType.Egress, rule));

    return Observable.forkJoin(addRuleRequests).map(() => securityGroup);
  }

  private getNetworkRuleCreationRequest(type: NetworkRuleType, rule: NetworkRule): void {
    const request = {};
  }
}
