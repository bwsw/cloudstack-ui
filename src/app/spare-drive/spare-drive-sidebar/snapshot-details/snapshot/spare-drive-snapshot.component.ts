import { Component, Input } from '@angular/core';
import { Snapshot } from '../../../../shared/models/snapshot.model';


@Component({
  selector: 'cs-spare-drive-snapshot',
  templateUrl: 'spare-drive-snapshot.component.html'
})
export class SpareDriveSnapshotComponent {
  @Input() public snapshot: Snapshot;
}
