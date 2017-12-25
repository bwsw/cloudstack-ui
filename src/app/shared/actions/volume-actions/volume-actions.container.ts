import { Component, Input } from '@angular/core';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { Store } from '@ngrx/store';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { State } from '../../../reducers/index';
import { Volume } from '../../models/volume.model';
import { AuthService } from '../../services/auth.service';
import { ISnapshotData } from './volume-snapshot';

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

// todo check
  public onVolumeSnapshots(snapshotData: ISnapshotData): void {
    this.store.dispatch(new snapshotActions.AddSnapshot({
      volume: this.volume,
      name: snapshotData.name,
      description: snapshotData.desc
    }));
  }
}
