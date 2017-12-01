import {
  Component,
  Input
} from '@angular/core';
import { Snapshot } from '../../../../shared/models/snapshot.model';
import { Volume } from '../../../../shared/models/volume.model';


@Component({
  selector: 'cs-volume-snapshot',
  templateUrl: 'volume-snapshot.component.html'
})
export class VolumeSnapshotComponent {
  @Input() public snapshot: Snapshot;
  @Input() public volume: Volume;
}
