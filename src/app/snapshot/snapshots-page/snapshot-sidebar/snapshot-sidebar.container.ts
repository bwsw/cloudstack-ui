import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { State } from '../../../reducers';

import * as fromSnapshots from '../../../reducers/snapshots/redux/snapshot.reducers';
import * as fromVolumes from '../../../reducers/volumes/redux/volumes.reducers';
import * as snapshotActions from '../../../reducers/snapshots/redux/snapshot.actions';

@Component({
  selector: 'cs-snapshot-sidebar-container',
  template: `
    <cs-snapshot-sidebar
      [snapshot]="snapshot$ | async"
      [volumes]="volumes$ | async"
      [isLoading]="isLoading$ | async"
    ></cs-snapshot-sidebar>`,
})
export class SnapshotSidebarContainerComponent implements OnInit {
  readonly snapshot$ = this.store.pipe(select(fromSnapshots.getSelectedSnapshot));
  readonly volumes$ = this.store.pipe(select(fromVolumes.selectEntities));
  readonly isLoading$ = this.store.pipe(select(fromSnapshots.isLoading));

  constructor(private store: Store<State>, private activatedRoute: ActivatedRoute) {}

  public ngOnInit() {
    const params = this.activatedRoute.snapshot.params;
    this.store.dispatch(new snapshotActions.LoadSelectedSnapshot(params['id']));
  }
}
