import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { State } from '../../reducers/index';
import { Volume } from '../../shared/models/volume.model';

import * as fromVolumes from '../../reducers/volumes/redux/volumes.reducers';
import * as fromSnapshots from '../../reducers/snapshots/redux/snapshot.reducers';
import * as snapshotActions from '../../reducers/snapshots/redux/snapshot.actions';

@Component({
  selector: 'cs-volume-snapshot-details-container',
  template: `
    <cs-volume-snapshot-details
      [volume]="volume$ | async"
      [isLoading]="isLoading$ | async"
      (snapshotAdded)="addSnapshot($event)"
    >
    </cs-volume-snapshot-details>`,
})
export class VolumeSnapshotDetailsContainerComponent {
  readonly volume$ = this.store.pipe(select(fromVolumes.getSelectedVolumeWithSnapshots));
  readonly isLoading$ = this.store.pipe(select(fromSnapshots.isLoading));

  constructor(public dialogService: DialogService, private store: Store<State>) {
    this.store.dispatch(new snapshotActions.LoadSnapshotRequest());
  }

  public addSnapshot(volume: Volume): void {
    this.store.dispatch(new snapshotActions.AddSnapshot(volume));
  }
}
