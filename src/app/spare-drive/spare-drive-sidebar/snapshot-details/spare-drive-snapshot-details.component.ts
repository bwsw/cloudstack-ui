import { Component, Input, OnInit } from '@angular/core';
import { Volume } from '../../../shared/models/volume.model';
import { SnapshotService } from '../../../shared/services/snapshot.service';


@Component({
  selector: 'cs-spare-drive-snapshot-details',
  templateUrl: 'spare-drive-snapshot-details.component.html'
})
export class SpareDriveSnapshotDetailsComponent implements OnInit {
  @Input() public volume: Volume;

  constructor(private snapshotService: SnapshotService) {}

  public ngOnInit(): void {
    this.snapshotService.onSnapshotDeleted.subscribe(snapshot => {
      this.volume.snapshots = this.volume.snapshots.filter(_ => _.id !== snapshot.id);
    });
  }
}
