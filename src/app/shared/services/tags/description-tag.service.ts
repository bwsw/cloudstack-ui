import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Taggable } from '../../interfaces/taggable.interface';
import { EntityTagService } from './entity-tag-service.interface';
import { TagService } from './tag.service';


@Injectable()
export class DescriptionTagService {
  constructor(private tagService: TagService) {
  }

  public setDescription(
    entity: Taggable,
    description: string,
    entityTagService: EntityTagService
  ): Observable<Taggable> {
    return this.tagService.update(
      entity,
      entity.resourceType,
      entityTagService.keys.description,
      description
    );
  }

  public removeDescription(
    entity: Taggable,
    entityTagService: EntityTagService
  ): Observable<Taggable> {
    const newEntity = Object.assign({}, entity);
    return this.tagService.remove({
      resourceIds: entity.id,
      resourceType: entity.resourceType,
      'tags[0].key': entityTagService.keys.description,
      'tags[0].value': ''
    })
      .map(() => {
        newEntity.tags = newEntity.tags.filter(t =>
          entityTagService.keys.description !== t.key
        );
        return newEntity;
      });
  }
}
