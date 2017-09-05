import { Component, OnInit } from '@angular/core';
import { Volume } from '../../../shared/models/volume.model';
import { SnapshotService } from '../../../shared/services/snapshot.service';
import { ActivatedRoute } from '@angular/router';
import { VolumeService } from '../../../shared/services/volume.service';


@Component({
  selector: 'cs-spare-drive-snapshot-details',
  templateUrl: 'spare-drive-snapshot-details.component.html'
})
export class SpareDriveSnapshotDetailsComponent implements OnInit {
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

  public ngOnInit(): void {
    this.snapshotService.onSnapshotDeleted.subscribe(snapshot => {
      this.volume.snapshots = this.volume.snapshots.filter(_ => _.id !== snapshot.id);
    });
  }
}
