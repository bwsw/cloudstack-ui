import { Component } from '@angular/core';
import { Volume } from '../../../shared/models/volume.model';
import { SnapshotService } from '../../../shared/services/snapshot.service';
import { ActivatedRoute } from '@angular/router';
import { VolumeService } from '../../../shared/services/volume.service';


@Component({
  selector: 'cs-volume-snapshot-details',
  templateUrl: 'volume-snapshot-details.component.html'
})
export class VolumeSnapshotDetailsComponent {
  public volume: Volume;

  constructor(
    private volumeService: VolumeService,
    private snapshotService: SnapshotService,
    private activatedRoute: ActivatedRoute
  ) {
    const params = this.activatedRoute.snapshot.parent.params;

    this.volumeService.get(params.id).subscribe(
      volume => {
        this.volume = volume;
      });
  }
}
