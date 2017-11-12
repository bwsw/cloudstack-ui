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
  entity: 'Tag',
  entityModel: Tag
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
    return this.getList({resourceId: entity.id, key})
      .map(tags => tags[0]);
  }

  public update(entity: any, entityName: string, key: string, value: any): Observable<any> {
    let newEntity = Object.assign({}, entity);

    const createObs = this.create({
      resourceIds: newEntity.id,
      resourceType: entityName,
      'tags[0].key': key,
      'tags[0].value': value,
    })
      .map(() => {
        if (newEntity.tags) {
          let newTags = Object.assign([], newEntity.tags);
          newTags.push(new Tag({
            resourceId: newEntity.id,
            resourceType: entityName,
            key,
            value
          }));
          return Object.assign({}, newEntity, { tags: newTags });
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

  public getValueFromTag(tag: Tag): any {
    if (tag) {
      return tag.value;
    }
  }
}
