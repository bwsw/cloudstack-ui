import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import {
  IcmpNetworkRule,
  NetworkProtocol,
  NetworkRule,
  PortNetworkRule,
} from '../../network-rule.model';
import { NetworkRuleType, SecurityGroup } from '../../sg.model';
import { BaseBackendService } from '../../../shared/services/base-backend.service';
import { SecurityGroupTagService } from '../../../shared/services/tags/security-group-tag.service';
import { NetworkRuleService } from '../network-rule.service';
import { BackendResource } from '../../../shared/decorators/backend-resource.decorator';
import { Rules } from '../../../shared/components/security-group-builder/rules';

interface TcpUdpNetworkRuleCreationParams {
  securityGroupId: string;
  ruleId: string;
  protocol: string;
  cidrList: string;
  startPort: number;
  endPort: number;
}

interface IcmpNetworkRuleCreationParams {
  securityGroupId: string;
  ruleId: string;
  protocol: string;
  cidrList: string;
  icmpCode: number;
  icmpType: number;
}

@Injectable()
@BackendResource({
  entity: 'SecurityGroup',
})
export abstract class SecurityGroupCreationService extends BaseBackendService<SecurityGroup> {
  constructor(
    protected securityGroupTagService: SecurityGroupTagService,
    protected http: HttpClient,
    private networkRuleService: NetworkRuleService,
  ) {
    super(http);
  }

  public createGroup(data: any, rules?: Rules): Observable<SecurityGroup> {
    const ingressRulesWithPossibleDuplicates = (rules && rules.ingress) || [];
    const egressRulesWithPossibleDuplicates = (rules && rules.egress) || [];
    const ingressRules = this.networkRuleService.removeDuplicateRules(
      ingressRulesWithPossibleDuplicates,
    );
    const egressRules = this.networkRuleService.removeDuplicateRules(
      egressRulesWithPossibleDuplicates,
    );

    return this.create(data).pipe(
      switchMap(securityGroup => {
        return this.authorizeRules(securityGroup, ingressRules, egressRules);
      }),
      switchMap(securityGroup => {
        return this.securityGroupCreationPostAction(securityGroup);
      }),
    );
  }

  protected securityGroupCreationPostAction(
    securityGroup: SecurityGroup,
  ): Observable<SecurityGroup> {
    return of(securityGroup);
  }

  private authorizeRules(
    securityGroup: SecurityGroup,
    ingressRules: NetworkRule[],
    egressRules: NetworkRule[],
  ): Observable<SecurityGroup> {
    if (!ingressRules.length && !egressRules.length) {
      return of(securityGroup);
    }

    const ingressRuleCreationRequests = this.getRuleCreationRequests(
      ingressRules,
      NetworkRuleType.Ingress,
      securityGroup,
    );

    const egressRuleCreationRequests = this.getRuleCreationRequests(
      egressRules,
      NetworkRuleType.Egress,
      securityGroup,
    );

    const ruleCreationRequests = ingressRuleCreationRequests.concat(egressRuleCreationRequests);

    const newSecurityGroup: SecurityGroup = {
      ...securityGroup,
      ingressrule: ingressRules,
      egressrule: egressRules,
    };

    return forkJoin(ruleCreationRequests).pipe(map(() => newSecurityGroup));
  }

  private getRuleCreationRequests(
    rules: NetworkRule[],
    ruleType: NetworkRuleType,
    securityGroup: SecurityGroup,
  ): Observable<NetworkRule>[] {
    return rules.map(rule => {
      const ruleCreationRequest = this.getNetworkRuleCreationParams(rule, securityGroup);
      return this.networkRuleService.addRule(ruleType, ruleCreationRequest);
    });
  }

  private getNetworkRuleCreationParams(rule: NetworkRule, securityGroup: SecurityGroup): any {
    if (rule.protocol === NetworkProtocol.TCP || rule.protocol === NetworkProtocol.UDP) {
      return this.getTcpUdpNetworkRuleCreationRequest(rule as PortNetworkRule, securityGroup);
    }

    if (rule.protocol === NetworkProtocol.ICMP) {
      return this.getIcmpNetworkRuleCreationRequest(rule as IcmpNetworkRule, securityGroup);
    }

    throw new Error('Unknown protocol');
  }

  private getTcpUdpNetworkRuleCreationRequest(
    rule: PortNetworkRule,
    securityGroup: SecurityGroup,
  ): TcpUdpNetworkRuleCreationParams {
    return {
      securityGroupId: securityGroup.id,
      ruleId: rule.ruleid,
      protocol: rule.protocol.toLowerCase(),
      cidrList: rule.cidr,
      startPort: rule.startport,
      endPort: rule.endport,
    };
  }

  private getIcmpNetworkRuleCreationRequest(
    rule: IcmpNetworkRule,
    securityGroup: SecurityGroup,
  ): IcmpNetworkRuleCreationParams {
    return {
      securityGroupId: securityGroup.id,
      ruleId: rule.ruleid,
      protocol: rule.protocol.toLowerCase(),
      cidrList: rule.cidr,
      icmpCode: rule.icmpcode,
      icmpType: rule.icmptype,
    };
  }
}
