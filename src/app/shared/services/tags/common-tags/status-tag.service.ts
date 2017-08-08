import { Injectable } from '@angular/core';
import { TagService } from '../tag.service';
import { Taggable } from '../../../interfaces/taggable.interface';
import { Observable } from 'rxjs/Observable';
import { EntityTagService } from '../entity-tag.service';


@Injectable()
export class StatusTagService {
  constructor(private tagService: TagService) {}

  public getStatus(entity: Taggable, entityTagService: EntityTagService): Observable<any> {
    return this.tagService.getTag(entity, entityTagService.keys.status)
      .map(tag => this.tagService.getValueFromTag(tag));
  }

  public setStatus(entity: Taggable, status: any, entityTagService: EntityTagService): Observable<Taggable> {
    return this.tagService.update(
      entity,
      entity.resourceType,
      entityTagService.keys.status,
      status
    );
  }
}
