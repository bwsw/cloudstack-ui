import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '../../../../reducers/index';
import { SnapshotPageMode } from '../../../../shared/models';
import { FilterService } from '../../../../shared/services/filter.service';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { WithUnsubscribe } from '../../../../utils/mixins/with-unsubscribe';

import * as  fromSnapshots from '../../../../reducers/snapshots/redux/snapshot.reducers';
import * as snapshotActions from '../../../../reducers/snapshots/redux/snapshot.actions';


@Component({
  selector: 'cs-snapshot-filter-container',
  template: `
    <cs-snapshot-filter
      [viewMode]="viewMode$ | async" 
      (viewModeChange)="onViewModeChange($event)"
    ></cs-snapshot-filter>`
})
export class SnapshotFilterContainerComponent extends WithUnsubscribe() implements OnInit {
  public filters$ = this.store.select(fromSnapshots.filters);
  public viewMode$ = this.store.select(fromSnapshots.viewMode);
  private filtersKey = 'snapshotFilters';
  private filterService = new FilterService(
    {
      mode: {
        type: 'string',
        options: [SnapshotPageMode.Volume, SnapshotPageMode.VM]
      }
    },
    this.router,
    this.storageService,
    this.filtersKey,
    this.activatedRoute
  );

  constructor(
    private store: Store<State>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private storageService: LocalStorageService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.initFilters();
  }

  public initFilters(): void {
    const params = this.filterService.getParams();
    const mode = params.mode || SnapshotPageMode.Volume;

    this.onViewModeChange(mode);

    this.filters$
      .takeUntil(this.unsubscribe$)
      .subscribe(filters => this.filterService.update({
        mode: filters.mode,
      }));
  }

  public onViewModeChange(mode) {
    this.store.dispatch(new snapshotActions.SnapshotFilterUpdate({
      mode
    }));
  }
}
