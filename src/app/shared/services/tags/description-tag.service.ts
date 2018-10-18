import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Taggable } from '../../interfaces/taggable.interface';
import { EntityTagService } from './entity-tag-service.interface';
import { TagService } from './tag.service';

@Injectable()
export class DescriptionTagService {
  constructor(private tagService: TagService) {}

  public setDescription(
    entity: Taggable,
    entityResourceType: string,
    description: string,
    entityTagService: EntityTagService,
  ): Observable<Taggable> {
    return this.tagService.update(
      entity,
      entityResourceType,
      entityTagService.keys.description,
      description,
    );
  }

  public removeDescription(
    entity: Taggable,
    entityResourceType: string,
    entityTagService: EntityTagService,
  ): Observable<Taggable> {
    const newEntity = { ...entity };
    return this.tagService
      .remove({
        resourceIds: entity.id,
        resourceType: entityResourceType,
        'tags[0].key': entityTagService.keys.description,
        'tags[0].value': '',
      })
      .pipe(
        map(() => {
          newEntity.tags = newEntity.tags.filter(t => entityTagService.keys.description !== t.key);
          return newEntity;
        }),
      );
  }
}
