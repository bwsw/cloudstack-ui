import { Injectable } from '@angular/core';
import { TagService } from './tag.service';
import { Taggable } from '../../interfaces/taggable.interface';
import { Observable } from 'rxjs/Observable';


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
