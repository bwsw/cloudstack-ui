import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Volume } from '../../../models/volume.model';
import { VolumeAction } from '../volume-action';
import { VolumeActionsService } from '../volume-actions.service';


@Component({
  selector: 'cs-volume-actions',
  templateUrl: 'volume-actions.component.html'
})
export class VolumeActionsComponent {
  @Input() public volume: Volume;
  @Output() public onVolumeDelete = new EventEmitter<Volume>();
  @Output() public onVolumeResize = new EventEmitter<Volume>();
  @Output() public onVolumeAttach = new EventEmitter<Volume>();
  @Output() public onVolumeDetach = new EventEmitter<Volume>();
  @Output() public onSnapshotAdd = new EventEmitter<Volume>();
  @Output() public onVolumeSchedule = new EventEmitter<Volume>();
  public actions: Array<any>;

  constructor(
    public volumeActionsService: VolumeActionsService
  ) {
    this.actions = this.volumeActionsService.actions;
  }

  public onAction(action, volume: Volume): void {
    switch (action.command) {
      case VolumeAction.DELETE: {
        this.onVolumeDelete.emit(volume);
        break
      }
      case VolumeAction.RESIZE: {
        this.onVolumeResize.emit(volume);
        break;
      }
      case VolumeAction.ATTACH: {
        this.onVolumeAttach.emit(volume);
        break;
      }
      case VolumeAction.DETACH: {
        this.onVolumeDetach.emit(volume);
        break;
      }
      case VolumeAction.SNAPSHOT: {
        this.onSnapshotAdd.emit(volume);
        break;
      }
      case VolumeAction.SCHEDULE: {
        this.onVolumeSchedule.emit(volume);
        break;
      }
    }
  }
}
