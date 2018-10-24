import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Volume } from '../../models';
import { TagService } from './tag.service';
import { DescriptionTagService } from './description-tag.service';
import { volumeTagKeys } from './volume-tag-keys';

export const volumeResourceType = 'Volume';

@Injectable()
export class VolumeTagService {
  public keys = volumeTagKeys;

  constructor(
    protected descriptionTagService: DescriptionTagService,
    protected tagService: TagService,
  ) {}

  public setDescription(volume: Volume, description: string): Observable<Volume> {
    return this.descriptionTagService.setDescription(
      volume,
      volumeResourceType,
      description,
      this,
    ) as Observable<Volume>;
  }

  public removeDescription(volume: Volume): Observable<Volume> {
    return this.descriptionTagService.removeDescription(
      volume,
      volumeResourceType,
      this,
    ) as Observable<Volume>;
  }
}
