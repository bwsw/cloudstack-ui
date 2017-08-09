import { Injectable } from '@angular/core';
import { EntityTagService } from './entity-tag.service';
import { Volume } from '../../models/volume.model';
import { Observable } from 'rxjs/Observable';
import { DescriptionTagService } from './common-tags/description-tag.service';
import { MarkForRemovalService } from './common-tags/mark-for-removal.service';
import { TagService } from './tag.service';


type VolumeTagKey = 'description';
const VolumeTagKeys = {
  description: 'description' as VolumeTagKey,
};

@Injectable()
export class VolumeTagService extends EntityTagService {
  public entityPrefix = 'volume';
  public keys = VolumeTagKeys;

  constructor(
    protected descriptionTagService: DescriptionTagService,
    protected markForRemovalService: MarkForRemovalService,
    protected tagService: TagService
  ) {
    super(tagService);
    this.initKeys();
  }

  public getDescription(volume: Volume): Observable<string> {
    return this.descriptionTagService.getDescription(volume, this);
  }

  public setDescription(volume: Volume, description: string): Observable<Volume> {
    return this.descriptionTagService.setDescription(volume, description, this);
  }

  public markForRemoval(volume: Volume): Observable<Volume> {
    return this.markForRemovalService.markForRemoval(volume);
  }
}
