import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { State } from '../../../reducers/index';
import { Volume } from '../../models/volume.model';
import { AuthService } from '../../services/auth.service';

import * as volumeActions from '../../../reducers/volumes/redux/volumes.actions';
import * as snapshotActions from '../../../reducers/snapshots/redux/snapshot.actions';

@Component({
  selector: 'cs-volume-actions-container',
  template: `
    <cs-volume-actions
      [volume]="volume"
      (onVolumeDelete)="onVolumeDelete($event)"
      (onVolumeAttach)="onVolumeAttach($event)"
      (onVolumeDetach)="onVolumeDetach($event)"
      (onSnapshotAdd)="onSnapshotAdd($event)"
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
    this.dialogService.confirm({
      message: 'DIALOG_MESSAGES.VOLUME.CONFIRM_DELETION'
    })
      .onErrorResumeNext()
      .filter(res => Boolean(res))
      .subscribe(() => {
        if (!!volume.snapshots.length) {
          this.dialogService.confirm({ message: 'DIALOG_MESSAGES.SNAPSHOT.CONFIRM_ALL_DELETION' })
            .onErrorResumeNext()
            .filter(res => Boolean(res))
            .subscribe(() => this.store.dispatch(new snapshotActions.DeleteSnapshots(volume.snapshots)));
        }
        this.store.dispatch(new volumeActions.DeleteVolume(volume));
      });
  }

  public onVolumeAttach(volume: Volume): void {
    this.store.dispatch(new volumeActions.AttachVolume(volume));
  }

  public onVolumeDetach(volume: Volume): void {
    this.store.dispatch(new volumeActions.DetachVolume(volume));
  }

  public onVolumeResize(volume: Volume): void {
    this.store.dispatch(new volumeActions.ResizeVolume(volume));
  }

  public onVolumeSchedule(volume: Volume): void {
    this.store.dispatch(new volumeActions.AddSnapshotSchedule(volume));
  }

  public onSnapshotAdd(volume: Volume): void {
    this.store.dispatch(new snapshotActions.AddSnapshot(volume));
  }
}
