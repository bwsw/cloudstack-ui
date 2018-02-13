import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Taggable } from '../../interfaces/taggable.interface';
import { Snapshot } from '../../models/snapshot.model';
import { DescriptionTagService } from './description-tag.service';
import { EntityTagService } from './entity-tag-service.interface';
import { TagService } from './tag.service';
import { SnapshotTagKeys } from './snapshot-tag-keys';

export const SnapshotResourceType = 'Snapshot';

@Injectable()
export class SnapshotTagService implements EntityTagService {
  public keys = SnapshotTagKeys;

  constructor(
    protected descriptionTagService: DescriptionTagService,
    protected tagService: TagService
  ) {
  }

  public setDescription(snapshot: Snapshot, description: string): Observable<Taggable> {
    return this.descriptionTagService.setDescription(
      snapshot,
      SnapshotResourceType,
      description,
      this
    );
  }

  public markForRemoval(snapshot: Snapshot): Observable<any> {
    return this.tagService.create(
      {
        resourceIds: snapshot.id,
        resourceType: SnapshotResourceType,
        'tags[0].key': 'status',
        'tags[0].value': 'removed',
      });
  }
}
