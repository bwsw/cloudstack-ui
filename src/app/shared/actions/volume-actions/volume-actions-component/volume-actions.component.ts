import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Volume } from '../../../models/volume.model';
import { VolumeAction } from '../volume-action';
import { VolumeActionsService } from '../volume-actions.service';

@Component({
  selector: 'cs-volume-actions',
  templateUrl: 'volume-actions.component.html',
})
export class VolumeActionsComponent {
  @Input()
  public volume: Volume;
  @Output()
  public volumeDeleted = new EventEmitter<Volume>();
  @Output()
  public volumeResized = new EventEmitter<Volume>();
  @Output()
  public volumeAttached = new EventEmitter<Volume>();
  @Output()
  public volumeDetached = new EventEmitter<Volume>();
  @Output()
  public snapshotAdded = new EventEmitter<Volume>();
  @Output()
  public volumeScheduled = new EventEmitter<Volume>();
  public actions: any[];

  constructor(public volumeActionsService: VolumeActionsService) {
    this.actions = this.volumeActionsService.actions;
  }

  public onAction(action, volume: Volume): void {
    switch (action.command) {
      case VolumeAction.DELETE: {
        this.volumeDeleted.emit(volume);
        break;
      }
      case VolumeAction.RESIZE: {
        this.volumeResized.emit(volume);
        break;
      }
      case VolumeAction.ATTACH: {
        this.volumeAttached.emit(volume);
        break;
      }
      case VolumeAction.DETACH: {
        this.volumeDetached.emit(volume);
        break;
      }
      case VolumeAction.SNAPSHOT: {
        this.snapshotAdded.emit(volume);
        break;
      }
      case VolumeAction.SCHEDULE: {
        this.volumeScheduled.emit(volume);
        break;
      }
      default:
        break;
    }
  }
}
