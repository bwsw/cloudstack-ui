import { Injectable } from '@angular/core';
import { EntityTagService } from './entity-tag.service';
import { Observable } from 'rxjs/Observable';
import { DescriptionTagService } from './common-tags/description-tag.service';
import { TagService } from './tag.service';
import { Snapshot } from '../../models/snapshot.model';


type SnapshotTagKey = 'description';

@Injectable()
export class SnapshotTagService extends EntityTagService {
  public keys = {
    description: 'description' as SnapshotTagKey,
    status: 'status' as SnapshotTagKey
  };
  protected entityPrefix = 'snapshot';

  constructor(
    protected descriptionTagService: DescriptionTagService,
    protected tagService: TagService
  ) {
    super(tagService);
  }

  public getDescription(snapshot: Snapshot): Observable<string> {
    return this.descriptionTagService.getDescription(snapshot, this);
  }

  public setDescription(snapshot: Snapshot, description: string): Observable<Snapshot> {
    return this.descriptionTagService.setDescription(snapshot, description, this);
  }
}
