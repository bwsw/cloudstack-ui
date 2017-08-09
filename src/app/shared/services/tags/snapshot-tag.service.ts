import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TagService } from './tag.service';
import { Snapshot } from '../../models/snapshot.model';
import { EntityTagService } from './entity-tag-service.interface';
import { DescriptionTagService } from './description-tag.service';


export const SnapshotTagKeys = {
  description: 'csui.snapshot.description'
};

@Injectable()
export class SnapshotTagService implements EntityTagService {
  public keys = SnapshotTagKeys;

  constructor(
    protected descriptionTagService: DescriptionTagService,
    protected tagService: TagService
  ) {}

  public getDescription(snapshot: Snapshot): Observable<string> {
    return this.descriptionTagService.getDescription(snapshot, this);
  }

  public setDescription(snapshot: Snapshot, description: string): Observable<Snapshot> {
    return this.descriptionTagService.setDescription(snapshot, description, this);
  }
}
