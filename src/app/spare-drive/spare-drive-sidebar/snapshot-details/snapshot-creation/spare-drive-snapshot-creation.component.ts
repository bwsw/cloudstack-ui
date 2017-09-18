import { Component, Input } from '@angular/core';
import { SpareDriveSnapshotAction } from '../../../../shared/actions/volume-actions/volume-snapshot';
import { Volume } from '../../../../shared/models/volume.model';


@Component({
  selector: 'cs-volume-snapshot-creation',
  templateUrl: 'volume-snapshot-creation.component.html',
  styleUrls: ['volume-snapshot-creation.component.scss']
})
export class SpareDriveSnapshotCreationComponent {
  @Input() public volume: Volume;

  constructor(private spareDriveSnapshotAction: SpareDriveSnapshotAction) {}

  public addSnapshot(): void {
    this.spareDriveSnapshotAction.activate(this.volume).subscribe();
  }
}
