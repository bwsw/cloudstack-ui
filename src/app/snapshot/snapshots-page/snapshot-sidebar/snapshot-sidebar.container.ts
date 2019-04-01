import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { State } from '../../../reducers';
import * as fromSnapshots from '../../../reducers/snapshots/redux/snapshot.reducers';
import * as fromVolumes from '../../../reducers/volumes/redux/volumes.reducers';
import { vmSnapshotsSelectors } from '../../../root-store/server-data/vm-snapshots';
import { Snapshot } from '../../../shared/models';
import { VmSnapshotSidebarViewModel } from '../../models/vm-snapshot-sidebar.view-model';
import { snapshotPageActions, snapshotPageSelectors } from '../../store';
import { SnapshotPageViewMode } from '../../types';

@Component({
  selector: 'cs-snapshot-sidebar-container',
  template: `
    <ng-container *loading="(isLoading$ | async)">
      <ng-container *ngIf="(snapshot$ | async) as snapshot" [ngSwitch]="viewMode$ | async">
        <cs-snapshot-sidebar
          *ngSwitchCase="viewModeType.Volume"
          [snapshot]="snapshot"
          [volumes]="volumes$ | async"
          [isLoading]="isLoading$ | async"
        ></cs-snapshot-sidebar>
        <cs-vm-snapshot-sidebar
          *ngSwitchCase="viewModeType.VM"
          [vmSnapshot]="snapshot"
        ></cs-vm-snapshot-sidebar>
      </ng-container>
    </ng-container>
  `,
})
export class SnapshotSidebarContainerComponent implements OnInit {
  readonly snapshot$: Observable<Snapshot | VmSnapshotSidebarViewModel> = this.store.pipe(
    select(snapshotPageSelectors.getSelectedSnapshotForSidebar),
  );
  readonly viewMode$: Observable<SnapshotPageViewMode> = this.store.pipe(
    select(snapshotPageSelectors.getViewMode),
  );
  readonly volumes$ = this.store.pipe(select(fromVolumes.selectEntities));
  readonly isLoading$ = combineLatest(
    this.store.pipe(select(fromSnapshots.isLoading)),
    this.store.pipe(select(vmSnapshotsSelectors.getIsLoading)),
  ).pipe(map((loadings: boolean[]) => loadings.some(value => value)));

  public readonly viewModeType = SnapshotPageViewMode;

  constructor(private store: Store<State>, private activatedRoute: ActivatedRoute) {}

  public ngOnInit() {
    const id = this.activatedRoute.snapshot.params.id;
    this.store.dispatch(new snapshotPageActions.Select({ id }));
  }
}
