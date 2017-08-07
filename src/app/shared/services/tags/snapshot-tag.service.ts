import { Injectable } from '@angular/core';
import { EntityTagService } from './entity-tag.service';
import { Volume } from '../../models/volume.model';
import { Observable } from 'rxjs/Observable';
import { DescriptionTagService } from './common-tags/description-tag.service';
import { TagService } from './tag.service';
import { Snapshot } from '../../models/snapshot.model';


type SnapshotTagKey = 'description';

@Injectable()
export class VolumeTagService extends EntityTagService {
  public keys = {
    description: 'description' as SnapshotTagKey,
    status: 'status' as SnapshotTagKey
  };
  protected entityPrefix = 'volume';

  constructor(
    protected descriptionTagService: DescriptionTagService,
    protected tagService: TagService
  ) {
    super(tagService);
  }

  public getDescription(snapshot: Snapshot): Observable<string> {
    return this.descriptionTagService.getDescription(snapshot, this);
  }

  public setDescription(volume: Volume, description: string): Observable<Volume> {
    return this.descriptionTagService.setDescription(volume, description, this);
  }
}
