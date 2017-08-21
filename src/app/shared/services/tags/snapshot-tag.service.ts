import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Taggable } from '../../interfaces/taggable.interface';
import { Snapshot } from '../../models/snapshot.model';
import { DescriptionTagService } from './description-tag.service';
import { EntityTagService } from './entity-tag-service.interface';
import { TagService } from './tag.service';


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

  public setDescription(snapshot: Snapshot, description: string): Observable<Taggable> {
    return this.descriptionTagService.setDescription(snapshot, description, this);
  }
}
