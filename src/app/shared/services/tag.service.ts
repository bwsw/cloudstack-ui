import { Observable } from 'rxjs';

import { BaseBackendService } from './base-backend.service';
import { Tag } from '../models/tag.model';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { AsyncJobService } from './async-job.service';


@BackendResource({
  entity: 'Tag',
  entityModel: Tag
})
export class TagService extends BaseBackendService<Tag> {
  constructor(private asyncJob: AsyncJobService) {
    super();
  }

  public create(params?: {}): Observable<any> {
    return super.create(params)
      .switchMap(tagJob => this.asyncJob.queryJob(tagJob.jobid));
  }

  public remove(params?: {}): Observable<any> {
    return super.remove(params)
      .switchMap(tagJob => this.asyncJob.queryJob(tagJob.jobid));
  }

  public update(entity: any, entityName: string, key: string, value: any): Observable<any> {
    if (!entity.tags || !entity.id) {
      throw new Error('This entity can\'t have tags');
    }

    let oldTag = entity.tags.find(tag => tag.key === key);

    let createObs = this.create({
      resourceIds: entity.id,
      resourceType: entityName,
      'tags[0].key': key,
      'tags[0].value': value,
    })
      .map(() => {
        entity.tags.push(new Tag({
          resourceId: entity.id,
          resourceType: entityName,
          key,
          value
        }));
        return entity;
      });

    if (!oldTag) {
      return createObs;
    }

    return this.remove({
      resourceIds: entity.id,
      resourceType: entityName,
      'tags[0].key': key,
      'tags[0].value': oldTag.value || ''
    })
      .map(() => entity.tags = entity.tags.filter(tag => tag.key !== oldTag.key))
      .switchMap(() => createObs);
  }
}
