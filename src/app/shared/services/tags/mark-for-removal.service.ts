import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TagService } from './tag.service';
import { Taggable } from '../../interfaces';


const deletionMarkKey = 'status';
const deletionMarkValue = 'removed';

@Injectable()
export class MarkForRemovalService {
  constructor(private tagService: TagService) {}

  public markForRemoval(entity: Taggable): Observable<Taggable> {
    return this.tagService.update(
      entity,
      entity.resourceType,
      deletionMarkKey,
      deletionMarkValue
    );
  }
}
