import { Injectable } from '@angular/core';
import { ConfigService } from '../shared/config.service';
import { SecurityGroup } from './security-group.model';
import { BaseBackendService } from '../shared/services/base-backend.service';
import { BackendResource } from '../shared/decorators/backend-resource.decorator';
import { TagService } from '../shared/services/tag.service';
import { AsyncJobService } from '../shared/services/async-job.service';

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

  public createTemplate(data: any) {
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

  public deleteTemplate(id: string) {
    return this.remove({ id });
  }
}
