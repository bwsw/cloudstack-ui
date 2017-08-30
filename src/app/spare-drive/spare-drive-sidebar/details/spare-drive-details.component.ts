import { Component, Input } from '@angular/core';
import { Volume } from '../../../shared/models/volume.model';
import { VolumeService } from '../../../shared/services/volume.service';
import { VolumeTagService } from '../../../shared/services/tags/volume-tag.service';


@Component({
  selector: 'cs-spare-drive-details',
  templateUrl: 'spare-drive-details.component.html'
})
export class SpareDriveDetailsComponent {
  @Input() public volume: Volume;

  constructor(
    private volumeService: VolumeService,
    private volumeTagService: VolumeTagService
  ) {}

  public changeDescription(newDescription: string): void {
    this.volumeTagService
      .setDescription(this.volume, newDescription)
      .onErrorResumeNext()
      .subscribe((volume: Volume) => {
        this.volume.tags = volume.tags;
        this.volumeService.onVolumeTagsChanged.next(volume);
      });
  }
}
