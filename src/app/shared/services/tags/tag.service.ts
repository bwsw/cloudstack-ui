import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BackendResource } from '../../decorators/backend-resource.decorator';
import { Taggable } from '../../interfaces/taggable.interface';
import { Tag } from '../../models/tag.model';
import { AsyncJobService } from '../async-job.service';
import { BaseBackendCachedService } from '../base-backend-cached.service';


@Injectable()
@BackendResource({
  entity: 'Tag'
})
export class TagService extends BaseBackendCachedService<Tag> {
  constructor(
    private asyncJob: AsyncJobService,
    protected http: HttpClient
  ) {
    super(http);
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
    const customApiFormat = {command: 'list', entity: 'Tag'};
    return super.getList(params, customApiFormat);
  }

  public getTag(entity: any, key: string): Observable<Tag> {
    return this.getList({resourceid: entity.id, key})
      .map(tags => tags[0]);
  }

  public update(entity: any, entityName: string, key: string, value: any): Observable<any> {
   const newEntity = Object.assign({}, entity);

    const createObs = this.create({
      resourceIds: newEntity.id,
      resourceType: entityName,
      'tags[0].key': key,
      'tags[0].value': value,
    })
      .map(() => {
        if (newEntity.tags) {
          newEntity.tags.push({
            resourceid: newEntity.id,
            resourcetype: entityName,
            key,
            value
          });
          return newEntity;
        }
        return newEntity;
      })
      .do(() => this.invalidateCache());

    return this.getTag(newEntity, key)
      .switchMap(tag => {
        return this.remove({
          resourceIds: newEntity.id,
          resourceType: entityName,
          'tags[0].key': key,
          'tags[0].value': tag.value || ''
        })
          .map(() => newEntity.tags = newEntity.tags.filter(t => tag.key !== t.key))
          .switchMap(() => createObs);
      })
      .catch(() => createObs);
  }

  public getValueFromTag(tag: Tag): any {
    if (tag) {
      return tag.value;
    }
  }
}
