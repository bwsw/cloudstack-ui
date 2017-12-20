import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { State } from '../../../reducers/index';
import * as volumeActions from '../../../reducers/volumes/redux/volumes.actions';
import { Volume } from '../../models/volume.model';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'cs-volume-actions-container',
  template: `
    <cs-volume-actions
      [volume]="volume"
      (onVolumeDelete)="onVolumeDelete($event)"
      (onVolumeAttach)="onVolumeAttach($event)"
      (onVolumeDetach)="onVolumeDetach($event)"
      (onVolumeSnapshots)="onVolumeSnapshots($event)"
      (onVolumeResize)="onVolumeResize($event)"
      (onVolumeSchedule)="onVolumeSchedule($event)"
    >
    </cs-volume-actions>`,
})
export class VolumeActionsContainerComponent {

  @Input() public volume: Volume;

  constructor(
    public dialogService: DialogService,
    public authService: AuthService,
    private store: Store<State>
  ) {
  }

  public onVolumeDelete(volume: Volume): void {
    this.store.dispatch(new volumeActions.DeleteVolume(volume));
  }

  public onVolumeAttach(volume: Volume): void {
    this.store.dispatch(new volumeActions.AttachVolume(volume));
  }

  public onVolumeDetach(volume: Volume): void {
    this.store.dispatch(new volumeActions.DetachVolume(volume));
  }

  public onVolumeSnapshots(volume: Volume): void {
    this.store.dispatch(new volumeActions.AddSnapshot(volume));
  }

  public onVolumeResize(volume: Volume): void {
    this.store.dispatch(new volumeActions.ResizeVolume(volume));
  }

  public onVolumeSchedule(volume: Volume): void {
    this.store.dispatch(new volumeActions.AddSnapshotSchedule(volume));
  }

}
