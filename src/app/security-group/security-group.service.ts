import { Injectable } from '@angular/core';
import { ConfigService } from '../shared/config.service';
import { SecurityGroup } from './security-group.model';
import { BaseBackendService } from '../shared/services/base-backend.service';
import { BackendResource } from '../shared/decorators/backend-resource.decorator';
import { NetworkRule } from '../security-group/security-group.model';


@Injectable()
@BackendResource({
  entity: 'SecurityGroup',
  entityModel: SecurityGroup
})
export class SecurityGroupService extends BaseBackendService<SecurityGroup> {

  constructor(private configService: ConfigService) {
    super();
  }

  public getTemplates(): Promise<Array<SecurityGroup>> {
    return this.configService.get('securityGroupTemplates')
      .then(groups => {
        for (let i = 0; i < groups.length; i++) {
          groups[i] = new SecurityGroup(groups[i]);
        }
        return groups;
      });
  }

  public createWithRules(
    params: {},
    ingressRules: Array<NetworkRule>,
    egressRules: Array<NetworkRule>
  ): Promise<SecurityGroup> {
    return this.create(params).then((securityGroup: SecurityGroup) => {
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

  public addRule(type: 'Ingress'|'Egress', data) {
    return this.postRequest(`authorize;${type}`, data)
      .then(res => {
        const response = res[`authorize${this.entity.toLowerCase()}${type.toLowerCase()}response`];

        return response.jobid;
      });
  }

  public removeRule(type: 'Ingress'|'Egress', data) {
    return this.postRequest(`revoke;${type}`, data)
      .then(res => {
        const response = res[`revoke${this.entity.toLowerCase()}${type.toLowerCase()}response`];

        return response.jobid;
      });
  }
}
