import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Volume, VolumeState } from '../../../../shared/models/volume.model';

@Component({
  selector: 'cs-volume-snapshot-creation',
  templateUrl: 'volume-snapshot-creation.component.html',
  styleUrls: ['volume-snapshot-creation.component.scss'],
})
export class VolumeSnapshotCreationComponent {
  @Input()
  public volume: Volume;
  @Output()
  public snapshotAdded = new EventEmitter<Volume>();

  public get isVolumeReady(): boolean {
    return this.volume && this.volume.state === VolumeState.Ready;
  }

  public addSnapshot(): void {
    this.snapshotAdded.emit(this.volume);
  }
}
