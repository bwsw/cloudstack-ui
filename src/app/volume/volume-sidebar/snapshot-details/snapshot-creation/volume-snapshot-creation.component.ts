import { Component, Input } from '@angular/core';
import { VolumeSnapshotAction } from '../../../../shared/actions/volume-actions/volume-snapshot';
import { Volume, VolumeState } from '../../../../shared/models/volume.model';


@Component({
  selector: 'cs-volume-snapshot-creation',
  templateUrl: 'volume-snapshot-creation.component.html',
  styleUrls: ['volume-snapshot-creation.component.scss']
})
export class VolumeSnapshotCreationComponent {
  @Input() public volume: Volume;

  constructor(private volumeSnapshotAction: VolumeSnapshotAction) {}

  public get isVolumeReady(): boolean {
    return this.volume && this.volume.state === VolumeState.Ready;
  }

  public addSnapshot(): void {
    this.volumeSnapshotAction.activate(this.volume).subscribe();
  }
}
