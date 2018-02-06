import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../reducers';

import * as fromSnapshots from '../../reducers/snapshots/redux/snapshot.reducers';
import * as fromVMs from '../../reducers/vm/redux/vm.reducers';
import * as fromVolumes from '../../reducers/volumes/redux/volumes.reducers';
import * as snapshotActions from '../../reducers/snapshots/redux/snapshot.actions';
import * as volumeActions from '../../reducers/volumes/redux/volumes.actions';
import * as vmActions from '../../reducers/vm/redux/vm.actions';

@Component({
  selector: 'cs-snapshots-container',
  template: `
    <cs-snapshots-page
      [snapshots]="snapshots$ | async"
      [isLoading]="isLoading$ | async"
      [volumes]="volumes$ | async"
      [virtualMachines]="virtualMachines$ | async"
    ></cs-snapshots-page>`
})
export class SnapshotsPageContainerComponent implements OnInit {
  readonly snapshots$ = this.store.select(fromSnapshots.selectFilteredSnapshots);
  readonly volumes$ = this.store.select(fromVolumes.selectEntities);
  readonly virtualMachines$ = this.store.select(fromVMs.selectEntities);
  readonly isLoading$ = this.store.select(fromSnapshots.isLoading);

  constructor(private store: Store<State>) {
  }

  public ngOnInit() {
    this.store.dispatch(new snapshotActions.LoadSnapshotRequest());
    this.store.dispatch(new volumeActions.LoadVolumesRequest());
    this.store.dispatch(new vmActions.LoadVMsRequest());
  }
}
