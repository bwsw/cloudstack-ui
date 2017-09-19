import { Component } from '@angular/core';
import { Volume } from '../../../shared/models/volume.model';
import { VolumeService } from '../../../shared/services/volume.service';
import { VolumeTagService } from '../../../shared/services/tags/volume/volume-tag.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'cs-spare-drive-details',
  templateUrl: 'spare-drive-details.component.html'
})
export class SpareDriveDetailsComponent {
  public volume: Volume;

  constructor(
    private volumeService: VolumeService,
    private volumeTagService: VolumeTagService,
    private activatedRoute: ActivatedRoute
  ) {
    const params = this.activatedRoute.snapshot.parent.params;

    this.volumeService.get(params.id).subscribe(
      volume => {
        this.volume = volume;
      });
  }

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
