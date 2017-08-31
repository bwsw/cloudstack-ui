import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NetworkProtocol, NetworkRule } from '../../network-rule.model';
import { Rules } from '../../sg-creation/sg-creation.component';
import { NetworkRuleType, SecurityGroup } from '../../sg.model';
import { BaseBackendService } from '../../../shared/services/base-backend.service';
import { SecurityGroupTagService } from '../../../shared/services/tags/security-group-tag.service';
import { NetworkRuleService } from '../network-rule.service';
import { BackendResource } from '../../../shared/decorators/backend-resource.decorator';


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
  entityModel: SecurityGroup
})
export abstract class SecurityGroupCreationService extends BaseBackendService<SecurityGroup> {
  constructor(
    protected securityGroupTagService: SecurityGroupTagService,
    private networkRuleService: NetworkRuleService
  ) {
    super();
  }

  public createGroup(data: any, rules?: Rules): Observable<SecurityGroup> {
    const ingressRulesWithPossibleDuplicates = rules && rules.ingress || [];
    const egressRulesWithPossibleDuplicates = rules && rules.egress || [];
    const ingressRules = this.networkRuleService.removeDuplicateRules(ingressRulesWithPossibleDuplicates);
    const egressRules = this.networkRuleService.removeDuplicateRules(egressRulesWithPossibleDuplicates);

    return this.create(data)
      .switchMap(securityGroup => {
        return this.authorizeRules(securityGroup, ingressRules, egressRules)
      })
      .switchMap(securityGroup => {
        return this.securityGroupCreationPostAction(securityGroup);
      });
  }

  protected securityGroupCreationPostAction(securityGroup: SecurityGroup): Observable<any> {
    return Observable.of(null);
  }

  private authorizeRules(
    securityGroup: SecurityGroup,
    ingressRules: Array<NetworkRule>,
    egressRules: Array<NetworkRule>
  ): Observable<SecurityGroup> {
    if (!ingressRules.length && !egressRules.length) {
      return Observable.of(securityGroup);
    }

    const ingressRuleCreationRequests = this.getRuleCreationRequests(
      ingressRules,
      NetworkRuleType.Ingress,
      securityGroup
    );

    const egressRuleCreationRequests = this.getRuleCreationRequests(
      ingressRules,
      NetworkRuleType.Egress,
      securityGroup
    );

    const ruleCreationRequests = ingressRuleCreationRequests.concat(egressRuleCreationRequests);

    return Observable.forkJoin(ruleCreationRequests).map(() => securityGroup);
  }

  private getRuleCreationRequests(
    rules: Array<NetworkRule>,
    ruleType: NetworkRuleType,
    securityGroup: SecurityGroup
  ): Array<Observable<NetworkRule>> {
    return rules.map(rule => {
      const ruleCreationRequest = this.getNetworkRuleCreationParams(rule, securityGroup);
      return this.networkRuleService.addRule(ruleType, ruleCreationRequest);
    });
  }

  private getNetworkRuleCreationParams(rule: NetworkRule, securityGroup: SecurityGroup): any {
    if (rule.protocol === NetworkProtocol.TCP || rule.protocol === NetworkProtocol.UDP) {
      return this.getTcpUdpNetworkRuleCreationRequest(rule, securityGroup);
    }

    if (rule.protocol === NetworkProtocol.ICMP) {
      return this.getIcmpNetworkRuleCreationRequest(rule, securityGroup);
    }

    throw new Error('Unknown protocol');
  }

  private getTcpUdpNetworkRuleCreationRequest(
    rule: NetworkRule,
    securityGroup: SecurityGroup
  ): TcpUdpNetworkRuleCreationParams {
    return {
      securityGroupId: securityGroup.id,
      ruleId: rule.ruleId,
      protocol: rule.protocol.toLowerCase(),
      cidrList: rule.CIDR,
      startPort: rule.startPort,
      endPort: rule.endPort
    };
  };

  private getIcmpNetworkRuleCreationRequest(
    rule: NetworkRule,
    securityGroup: SecurityGroup
  ): IcmpNetworkRuleCreationParams {
    return {
      securityGroupId: securityGroup.id,
      ruleId: rule.ruleId,
      protocol: rule.protocol.toLowerCase(),
      cidrList: rule.CIDR,
      icmpCode: rule.icmpCode,
      icmpType: rule.icmpType
    };
  }
}
