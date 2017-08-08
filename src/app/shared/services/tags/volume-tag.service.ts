import { Injectable } from '@angular/core';
import { EntityTagService } from './entity-tag.service';
import { Volume } from '../../models/volume.model';
import { Observable } from 'rxjs/Observable';
import { DescriptionTagService } from './common-tags/description-tag.service';
import { StatusTagService } from './common-tags/status-tag.service';
import { TagService } from './tag.service';


type VolumeTagKey = 'description' | 'status';

type VolumeStatus = 'removed';
const VolumesStatuses = {
  removed: 'removed' as VolumeStatus
};

@Injectable()
export class VolumeTagService extends EntityTagService {
  public keys = {
    description: 'description' as VolumeTagKey,
    status: 'status' as VolumeTagKey
  };
  protected entityPrefix = 'volume';

  constructor(
    protected descriptionTagService: DescriptionTagService,
    protected statusTagService: StatusTagService,
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

  public getStatus(volume: Volume): Observable<VolumeStatus> {
    return this.statusTagService.getStatus(volume, this);
  }

  public setStatus(volume: Volume, status: VolumeStatus): Observable<Volume> {
    return this.statusTagService.setStatus(volume, status, this);
  }
}
