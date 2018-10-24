import { Component, Input } from '@angular/core';
import { getDateSnapshotCreated, getSnapshotDescription } from '../../../../shared/models';
import { Snapshot } from '../../../../shared/models/snapshot.model';
import { Volume } from '../../../../shared/models/volume.model';

@Component({
  selector: 'cs-volume-snapshot',
  templateUrl: 'volume-snapshot.component.html',
})
export class VolumeSnapshotComponent {
  @Input()
  public snapshot: Snapshot;
  @Input()
  public volume: Volume;

  public get snapshotDescription(): string {
    return getSnapshotDescription(this.snapshot);
  }

  public get snapshotCreated(): Date {
    return getDateSnapshotCreated(this.snapshot);
  }
}
