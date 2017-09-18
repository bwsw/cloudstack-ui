import { Component, Input } from '@angular/core';
import { Snapshot } from '../../../../shared/models/snapshot.model';


@Component({
  selector: 'cs-volume-snapshot',
  templateUrl: 'volume-snapshot.component.html'
})
export class VolumeSnapshotComponent {
  @Input() public snapshot: Snapshot;
}
