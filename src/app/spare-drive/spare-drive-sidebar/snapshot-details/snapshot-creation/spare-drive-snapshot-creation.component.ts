import { Component, Input } from '@angular/core';
import { SpareDriveSnapshotAction } from '../../../../shared/actions/spare-drive-actions/spare-drive-snapshot';
import { Volume, VolumeState } from '../../../../shared/models/volume.model';


@Component({
  selector: 'cs-spare-drive-snapshot-creation',
  templateUrl: 'spare-drive-snapshot-creation.component.html',
  styleUrls: ['spare-drive-snapshot-creation.component.scss']
})
export class SpareDriveSnapshotCreationComponent {
  @Input() public volume: Volume;

  constructor(private spareDriveSnapshotAction: SpareDriveSnapshotAction) {}

  public get isVolumeReady(): boolean {
    return this.volume && this.volume.state === VolumeState.Ready;
  }

  public addSnapshot(): void {
    this.spareDriveSnapshotAction.activate(this.volume).subscribe();
  }
}
