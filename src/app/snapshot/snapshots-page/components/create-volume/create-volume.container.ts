import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { select, Store } from '@ngrx/store';
import { State } from '../../../../reducers/index';
import { Snapshot } from '../../../../shared/models/index';

import * as fromVolumes from '../../../../reducers/volumes/redux/volumes.reducers';
import * as volumeActions from '../../../../reducers/volumes/redux/volumes.actions';

@Component({
  selector: 'cs-create-volume-from-snapshot-container',
  template: `
    <cs-create-volume-from-snapshot
      [isLoading]="isFormLoading$ | async"
      (volumeCreate)="onVolumeCreate($event)"
    ></cs-create-volume-from-snapshot>`,
})
export class CreateVolumeFromSnapshotContainerComponent {
  readonly isFormLoading$ = this.store.pipe(select(fromVolumes.isFormLoading));
  private snapshot: Snapshot;

  constructor(private store: Store<State>, @Inject(MAT_DIALOG_DATA) data: any) {
    this.snapshot = data.snapshot;

    if (data.snapshot) {
    }
  }

  public onVolumeCreate(name: string) {
    this.store.dispatch(
      new volumeActions.CreateVolumeFromSnapshot({
        name,
        snapshotId: this.snapshot.id,
      }),
    );
  }
}
