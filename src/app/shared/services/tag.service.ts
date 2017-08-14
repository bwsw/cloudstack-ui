import { Observable } from 'rxjs/Observable';

import { Tag } from '../models/tag.model';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { AsyncJobService } from './async-job.service';
import { BaseBackendCachedService } from './base-backend-cached.service';
import { Taggable } from '../interfaces/taggable.interface';


@BackendResource({
  entity: 'Tag',
  entityModel: Tag
})
export class TagService extends BaseBackendCachedService<Tag> {
  constructor(private asyncJob: AsyncJobService) {
    super();
  }

  public create(params?: {}): Observable<any> {
    return super.create(params)
      .switchMap(tagJob => this.asyncJob.queryJob(tagJob.jobid))
      .do(() => this.invalidateCache());
  }

  public remove(params?: {}): Observable<any> {
    return super.remove(params)
      .switchMap(tagJob => this.asyncJob.queryJob(tagJob.jobid))
      .catch(() => Observable.of(null))
      .do(() => this.invalidateCache());
  }

  public getList(params?: {}): Observable<Array<Tag>> {
    const customApiFormat = { command: 'list', entity: 'Tag' };
    return super.getList(params, customApiFormat);
  }

  public getTag(entity: any, key: string): Observable<Tag> {
    return this.getList({ resourceId: entity.id, key }).map(tags => tags.length ? tags[0] : undefined);
  }

  public update(entity: any, entityName: string, key: string, value: any): Observable<any> {
    const createObs = this.create({
      resourceIds: entity.id,
      resourceType: entityName,
      'tags[0].key': key,
      'tags[0].value': value,
    })
      .map(() => {
        if (entity.tags) {
          entity.tags.push(new Tag({
            resourceId: entity.id,
            resourceType: entityName,
            key,
            value
          }));
        }
        return entity;
      })
      .do(() => this.invalidateCache());

    return this.getTag(entity, key)
      .switchMap(tag => {
        return this.remove({
          resourceIds: entity.id,
          resourceType: entityName,
          'tags[0].key': key,
          'tags[0].value': tag.value || ''
        })
          .map(() => entity.tags = entity.tags.filter(t => tag.key !== t.key))
          .switchMap(() => createObs);
      })
      .catch(() => createObs);
  }

  public copyTagsToEntity(tags: Array<Tag>, entity: Taggable): Observable<any> {
    const copyRequests = tags.map(tag => {
      return this.update(
        entity,
        entity.resourceType,
        tag.key,
        tag.value
      );
    });

    if (!copyRequests.length) {
      return Observable.of(null);
    } else {
      return Observable.forkJoin(...copyRequests);
    }
  }
}
