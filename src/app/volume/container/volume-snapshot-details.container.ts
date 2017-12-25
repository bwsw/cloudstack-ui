import { Component } from '@angular/core';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { Store } from '@ngrx/store';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { State } from '../../reducers/index';
import { Volume } from '../../shared/models/volume.model';
import { ISnapshotData } from '../../shared/actions/volume-actions/volume-snapshot';

import * as fromVolumes from '../../reducers/volumes/redux/volumes.reducers';
import * as fromSnapshots from '../../reducers/snapshots/redux/snapshot.reducers';
import * as snapshotActions from '../../reducers/snapshots/redux/snapshot.actions';
import * as volumeActions from '../../reducers/volumes/redux/volumes.actions';

@Component({
  selector: 'cs-volume-snapshot-details-container',
  template: `
    <cs-volume-snapshot-details
      [volume]="volume$ | async"
      [isLoading]="isLoading$ | async"
      (onSnapshotAdd)="addSnapshot($event)"
    >
    </cs-volume-snapshot-details>`,
})
export class VolumeSnapshotDetailsContainerComponent {
  readonly volume$ = this.store.select(fromVolumes.getSelectedVolume);
  readonly isLoading$ = this.store.select(fromSnapshots.isLoading);

  constructor(
    public dialogService: DialogService,
    private store: Store<State>,
  ) {
    this.store.dispatch(new snapshotActions.LoadSnapshotRequest());
  }

  public addSnapshot(volume: Volume): void {
    this.store.dispatch(new volumeActions.AddSnapshot(volume));
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
