import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TagService } from './tag.service';
import { Taggable } from '../../interfaces';


const deletionMarkKey = 'status';
const deletionMarkValue = 'removed';

@Injectable()
export class MarkForRemovalService {
  constructor(private tagService: TagService) {}

  public markForRemoval<T extends Taggable>(entity: T): Observable<T> {
    return this.tagService.update(
      entity,
      entity.resourceType,
      deletionMarkKey,
      deletionMarkValue
    );
  }
}
