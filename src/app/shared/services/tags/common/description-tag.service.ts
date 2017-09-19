import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Taggable } from '../../../interfaces/taggable.interface';
import { EntityTagService } from './entity-tag-service.interface';
import { TagService } from './tag.service';


@Injectable()
export class DescriptionTagService {
  constructor(private tagService: TagService) {}

  public getDescription(entity: Taggable, entityTagService: EntityTagService): Observable<string> {
    return this.tagService.getTag(entity, entityTagService.keys.description)
      .map(tag => this.tagService.getValueFromTag(tag));
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
}
