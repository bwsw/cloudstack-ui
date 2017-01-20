import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { SecurityGroup } from '../../security-group/security-group.model';
import { BaseBackendService } from './base-backend.service';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { TagService } from './tag.service';
import { AsyncJobService } from './async-job.service';
import { NetworkRule } from '../../security-group/security-group.model';


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

  public getTemplates(): Promise<Array<SecurityGroup>> {
    return this.configService.get('securityGroupTemplates')
      .then(groups => {
        for (let i = 0; i < groups.length; i++) {
          groups[i] = new SecurityGroup(groups[i]);
        }
        return groups;
      });
  }

  public createTemplate(data: any): Promise<any> {
    return this.create(data)
      .then(res => {
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
        const tagPromise = this.tagService.create(params)
          .then(tagJob => {
            return this.asyncJobService.addJob(tagJob.jobid)
              .map(result => {
                let jobResult: any = {};
                if (result && result.jobResultCode === 0) {
                  jobResult.success = result.jobResult.success;
                  jobResult.tag = { key: 'labels', value: data.labels };
                } else {
                  jobResult.success = false;
                }
                result.jobResult = jobResult;
                this.asyncJobService.event.next(result);
                return result;
              });
          });
        return Promise.all([res, tagPromise]);
      });
  }

  public deleteTemplate(id: string): Promise<any> {
    return this.remove({ id });
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

  public addRule(type: 'Ingress'|'Egress', data): Promise<string> {
    return this.postRequest(`authorize;${type}`, data)
      .then(res => {
        const response = res[`authorize${this.entity.toLowerCase()}${type.toLowerCase()}response`];

        return response.jobid;
      });
  }

  public removeRule(type: 'Ingress'|'Egress', data): Promise<string> {
    return this.postRequest(`revoke;${type}`, data)
      .then(res => {
        const response = res[`revoke${this.entity.toLowerCase()}${type.toLowerCase()}response`];

        return response.jobid;
      });
  }
}
