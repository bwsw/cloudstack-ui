import { Component, Input } from '@angular/core';
import { Volume } from '../../../shared/models/volume.model';


@Component({
  selector: 'cs-spare-drive-snapshot-details',
  templateUrl: 'spare-drive-snapshot-details.component.html'
})
export class SpareDriveSnapshotDetailsComponent {
  @Input() public volume: Volume;
}
