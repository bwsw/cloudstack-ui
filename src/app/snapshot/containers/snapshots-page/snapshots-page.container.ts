import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import * as snapshotActions from '../../../reducers/snapshots/redux/snapshot.actions';
import * as fromSnapshots from '../../../reducers/snapshots/redux/snapshot.reducers';
import * as vmActions from '../../../reducers/vm/redux/vm.actions';
import * as fromVMs from '../../../reducers/vm/redux/vm.reducers';
import * as volumeActions from '../../../reducers/volumes/redux/volumes.actions';
import * as fromVolumes from '../../../reducers/volumes/redux/volumes.reducers';
import { State, vmSnapshotsActions } from '../../../root-store';
import { snapshotPageSelectors, vmSnapshotsSelectors } from '../../store';

@Component({
  selector: 'cs-snapshots-page-container',
  template: `
    <cs-snapshots-page
      [snapshots]="snapshots$ | async"
      [vmSnapshots]="vmSnapshots$ | async"
      [viewMode]="viewMode$ | async"
      [groupings]="groupings$ | async"
      [isLoading]="isLoading$ | async"
      [query]="query$ | async"
      [volumes]="volumes$ | async"
      [virtualMachines]="virtualMachines$ | async"
    ></cs-snapshots-page>`,
})
export class SnapshotsPageContainerComponent implements OnInit, AfterViewInit {
  readonly snapshots$ = this.store.pipe(select(fromSnapshots.selectFilteredSnapshots));
  readonly volumes$ = this.store.pipe(select(fromVolumes.selectEntities));
  readonly virtualMachines$ = this.store.pipe(select(fromVMs.selectEntities));
  readonly isLoading$ = this.store.pipe(select(fromSnapshots.isLoading));
  readonly groupings$ = this.store.pipe(select(snapshotPageSelectors.getGroupings));
  readonly query$ = this.store.pipe(
    select(snapshotPageSelectors.getFilters),
    map(filters => filters.query),
  );
  readonly vmSnapshots$ = this.store.pipe(select(vmSnapshotsSelectors.getVmSnapshots));
  readonly viewMode$ = this.store.pipe(select(snapshotPageSelectors.getViewMode));

  constructor(private store: Store<State>, private cd: ChangeDetectorRef) {}

  public ngOnInit() {
    this.store.dispatch(new snapshotActions.LoadSnapshotRequest());
    this.store.dispatch(new vmSnapshotsActions.Load());
    this.store.dispatch(new volumeActions.LoadVolumesRequest());
    this.store.dispatch(new vmActions.LoadVMsRequest());
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }
}
