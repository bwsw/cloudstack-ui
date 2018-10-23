import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, onErrorResumeNext } from 'rxjs/operators';

import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { State } from '../../../reducers';
import { Volume } from '../../models';
import { AuthService } from '../../services/auth.service';

import * as volumeActions from '../../../reducers/volumes/redux/volumes.actions';
import * as snapshotActions from '../../../reducers/snapshots/redux/snapshot.actions';

@Component({
  selector: 'cs-volume-actions-container',
  template: `
    <cs-volume-actions
      [volume]="volume"
      (volumeDeleted)="onVolumeDelete($event)"
      (volumeAttached)="onVolumeAttach($event)"
      (volumeDetached)="onVolumeDetach($event)"
      (snapshotAdded)="onSnapshotAdd($event)"
      (volumeResized)="onVolumeResize($event)"
      (volumeScheduled)="onVolumeSchedule($event)"
    >
    </cs-volume-actions>`,
})
export class VolumeActionsContainerComponent {
  @Input()
  public volume: Volume;

  constructor(
    public dialogService: DialogService,
    public authService: AuthService,
    private store: Store<State>,
  ) {}

  public onVolumeDelete(volume: Volume): void {
    this.dialogService
      .confirm({
        message: 'DIALOG_MESSAGES.VOLUME.CONFIRM_DELETION',
      })
      .pipe(
        onErrorResumeNext(),
        filter(Boolean),
      )
      .subscribe(() => {
        if (volume.snapshots && !!volume.snapshots.length) {
          this.dialogService
            .confirm({ message: 'DIALOG_MESSAGES.SNAPSHOT.CONFIRM_ALL_DELETION' })
            .pipe(
              onErrorResumeNext(),
              filter(Boolean),
            )
            .subscribe(() =>
              this.store.dispatch(new snapshotActions.DeleteSnapshots(volume.snapshots)),
            );
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
