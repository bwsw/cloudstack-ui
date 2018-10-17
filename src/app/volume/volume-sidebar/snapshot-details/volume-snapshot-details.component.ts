import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Volume } from '../../../shared/models/volume.model';

@Component({
  selector: 'cs-volume-snapshot-details',
  templateUrl: 'volume-snapshot-details.component.html',
})
export class VolumeSnapshotDetailsComponent {
  @Input()
  public volume: Volume;
  @Input()
  public isLoading: boolean;
  @Output()
  public snapshotAdded = new EventEmitter<Volume>();
}
