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
      .switchMap(tagJob => this.asyncJob.queryJob(tagJob.jobid))
      .catch(() => Observable.of(null));
  }

  public getList(params?: {}): Observable<Array<Tag>> {
    return this.sendCommand('list', params)
      .map(response => {
        const entity = this.entity.toLowerCase();
        const result = response[entity];
        if (!result) {
          return [];
        }
        return result.map(m => this.prepareModel(m)) as Array<Tag>;
      });
  }

  public getTag(entity: any, key: string): Observable<Tag> {
    return this.getList({ resourceIds: entity.id, key }).map(tags => tags.length ? tags[0] : undefined);
  }

  public update(entity: any, entityName: string, key: string, value: any): Observable<any> {
    if (!entity.id) {
      throw new Error('This entity can\'t have tags');
    }

    let createObs = this.create({
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
      });

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
}
