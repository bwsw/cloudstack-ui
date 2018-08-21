import { Injectable } from '@angular/core';
import { Volume } from '../../models/volume.model';
import { Observable } from 'rxjs/Observable';
import { TagService } from './tag.service';
import { DescriptionTagService } from './description-tag.service';
import { VolumeTagKeys } from './volume-tag-keys';

export const VolumeResourceType = 'Volume';

@Injectable()
export class VolumeTagService {
  public keys = VolumeTagKeys;

  constructor(
    protected descriptionTagService: DescriptionTagService,
    protected tagService: TagService
  ) {
  }

  public setDescription(volume: Volume, description: string): Observable<Volume> {
    return this.descriptionTagService.setDescription(
      volume,
      VolumeResourceType,
      description,
      this
    ) as Observable<Volume>;
  }

  public removeDescription(volume: Volume): Observable<Volume> {
    return this.descriptionTagService.removeDescription(
      volume,
      VolumeResourceType,
      this
    ) as Observable<Volume>;
  }
}
