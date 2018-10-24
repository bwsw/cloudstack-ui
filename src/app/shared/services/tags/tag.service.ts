import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { BackendResource } from '../../decorators';
import { Tag } from '../../models';
import { AsyncJobService } from '../async-job.service';
import { BaseBackendService } from '../base-backend.service';

@Injectable()
@BackendResource({
  entity: 'Tag',
})
export class TagService extends BaseBackendService<Tag> {
  constructor(private asyncJob: AsyncJobService, protected http: HttpClient) {
    super(http);
  }

  public create(params?: {}): Observable<any> {
    return super
      .create(params)
      .pipe(switchMap(tagJob => this.asyncJob.queryJob(tagJob.jobid, this.entity)));
  }

  public remove(params?: {}): Observable<any> {
    return super.remove(params).pipe(
      switchMap(tagJob => this.asyncJob.queryJob(tagJob.jobid, this.entity)),
      catchError(() => of(null)),
    );
  }

  public getList(params?: {}): Observable<Tag[]> {
    const customApiFormat = { command: 'list', entity: 'Tag' };
    return super.getList(params, customApiFormat);
  }

  public getTag(entity: any, key: string): Observable<Tag> {
    return this.getList({ key, resourceid: entity.id }).pipe(map(tags => tags[0]));
  }

  public update(entity: any, entityName: string, key: string, value: any): Observable<any> {
    const newEntity = { ...entity };

    const createObs = this.create({
      resourceIds: newEntity.id,
      resourceType: entityName,
      'tags[0].key': key,
      'tags[0].value': value,
    }).pipe(
      map(() => {
        if (newEntity.tags) {
          const newTags: Tag[] = [...newEntity.tags];
          newTags.push({
            key,
            value,
            resourceid: newEntity.id,
            resourcetype: entityName,
          } as Tag);
          return { ...newEntity, tags: newTags };
        }
        return newEntity;
      }),
    );

    return this.getTag(newEntity, key).pipe(
      switchMap(tag => {
        return this.remove({
          resourceIds: newEntity.id,
          resourceType: entityName,
          'tags[0].key': key,
          'tags[0].value': tag.value || '',
        }).pipe(
          map(() => (newEntity.tags = newEntity.tags.filter(t => tag.key !== t.key))),
          switchMap(() => createObs),
        );
      }),
      catchError(() => createObs),
    );
  }

  public getValueFromTag(tag: Tag): any {
    if (tag) {
      return tag.value;
    }
  }
}
