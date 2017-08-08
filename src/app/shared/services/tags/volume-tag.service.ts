import { Injectable } from '@angular/core';
import { EntityTagService } from './entity-tag.service';
import { Volume } from '../../models/volume.model';
import { Observable } from 'rxjs/Observable';
import { DescriptionTagService } from './common-tags/description-tag.service';
import { MarkForRemovalService } from './common-tags/mark-for-removal.service';
import { TagService } from './tag.service';


type VolumeTagKey = 'description';

@Injectable()
export class VolumeTagService extends EntityTagService {
  public keys = {
    description: 'description' as VolumeTagKey,
  };
  protected entityPrefix = 'volume';

  constructor(
    protected descriptionTagService: DescriptionTagService,
    protected markForRemovalService: MarkForRemovalService,
    protected tagService: TagService
  ) {
    super(tagService);
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
