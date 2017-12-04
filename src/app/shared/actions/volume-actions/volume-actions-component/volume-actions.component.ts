import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { Volume } from '../../../models/volume.model';
import { VolumeActionsService } from '../volume-actions.service';
import { VolumeAction } from '../volume-action';
import { ISnapshotData } from '../volume-snapshot';


@Component({
  selector: 'cs-volume-actions',
  templateUrl: 'volume-actions.component.html'
})
export class VolumeActionsComponent {
  @Input() public volume: Volume;
  @Output() public onVolumeDelete = new EventEmitter<Volume>();
  @Output() public onVolumeResize = new EventEmitter<any>();
  @Output() public onVolumeAttach = new EventEmitter<string>();
  @Output() public onVolumeDetach = new EventEmitter<Volume>();
  @Output() public onVolumeSnapshots = new EventEmitter<ISnapshotData>();
  public actions: Array<VolumeAction>;

  constructor(
    public volumeActionsService: VolumeActionsService
  ) {
    this.actions = this.volumeActionsService.actions;
  }

  public onAction(action: VolumeAction, volume: Volume): void {
    action.activate(volume).subscribe(
      res => {
        switch (action.command){
          case 'delete': {
            this.onVolumeDelete.emit(res);
            break
          }
          case 'resize': {
            this.onVolumeResize.emit(res);
            break;
          }
          case 'attach': {
            this.onVolumeAttach.emit(res);
            break;
          }
          case 'detach': {
            this.onVolumeDetach.emit(res);
            break;
          }
          case 'snapshot': {
            this.onVolumeSnapshots.emit(res);
            break;
          }
        }
      });
  }
}
