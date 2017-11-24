import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { Volume } from '../../../shared/models/volume.model';
import { ISnapshotData } from '../../../shared/actions/volume-actions/volume-snapshot';


@Component({
  selector: 'cs-volume-snapshot-details',
  templateUrl: 'volume-snapshot-details.component.html'
})
export class VolumeSnapshotDetailsComponent {
  @Input() public volume: Volume;
  @Output() public onVolumeSnapshots = new EventEmitter<ISnapshotData>();

}
