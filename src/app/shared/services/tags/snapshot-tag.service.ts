import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Taggable } from '../../interfaces';
import { Snapshot } from '../../models';
import { DescriptionTagService } from './description-tag.service';
import { EntityTagService } from './entity-tag-service.interface';
import { TagService } from './tag.service';
import { snapshotTagKeys } from './snapshot-tag-keys';

export const snapshotResourceType = 'Snapshot';

@Injectable()
export class SnapshotTagService implements EntityTagService {
  public keys = snapshotTagKeys;

  constructor(
    protected descriptionTagService: DescriptionTagService,
    protected tagService: TagService,
  ) {}

  public setDescription(snapshot: Snapshot, description: string): Observable<Taggable> {
    return this.descriptionTagService.setDescription(
      snapshot,
      snapshotResourceType,
      description,
      this,
    );
  }

  public markForRemoval(snapshot: Snapshot): Observable<any> {
    return this.tagService.create({
      resourceIds: snapshot.id,
      resourceType: snapshotResourceType,
      'tags[0].key': 'status',
      'tags[0].value': 'removed',
    });
  }
}
