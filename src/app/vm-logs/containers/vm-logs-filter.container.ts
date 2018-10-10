import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { State } from '../../reducers';
import { FilterService } from '../../shared/services/filter.service';
import { SessionStorageService } from '../../shared/services/session-storage.service';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';
import * as vmActions from '../../reducers/vm/redux/vm.actions';
import * as vmLogActions from '../redux/vm-logs.actions';
import * as fromVMs from '../../reducers/vm/redux/vm.reducers';
import * as fromVmLogs from '../redux/vm-logs.reducers';

const FILTER_KEY = 'logsFilters';

@Component({
  selector: 'cs-vm-logs-filter-container',
  template: `
    <cs-vm-logs-filter
      *loading="loading$ | async"
      [vms]="vms$ | async"
      [selectedVmId]="selectedVmId$ | async"
      (onVmChange)="onVmChange($event)"
    ></cs-vm-logs-filter>`
})
export class VmLogsFilterContainerComponent extends WithUnsubscribe() implements OnInit, AfterViewInit {

  readonly filters$ = this.store.pipe(select(fromVmLogs.filters));
  readonly loading$ = this.store.pipe(select(fromVmLogs.isLoading));
  readonly vms$ = this.store.pipe(select(fromVMs.selectAll));
  readonly selectedVmId$ = this.store.pipe(select(fromVmLogs.filterSelectedVmId));

  private filterService = new FilterService(
    { vm: { type: 'string' } },
    this.router,
    this.sessionStorage,
    FILTER_KEY,
    this.activatedRoute
  );

  constructor(
    private cd: ChangeDetectorRef,
    private store: Store<State>,
    private sessionStorage: SessionStorageService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    super();
  }

  public onVmChange(selectedVmId) {
    this.store.dispatch(new vmLogActions.VmLogsFilterUpdate({
      selectedVmId
    }));
  }

  private initFilters(): void {
    const params = this.filterService.getParams();
    const selectedVmId = params['vm'];
    this.store.dispatch(new vmLogActions.VmLogsFilterUpdate({
      selectedVmId
    }));
  }

  public ngOnInit() {
    this.store.dispatch(new vmActions.LoadVMsRequest());
    this.initFilters();
    this.filters$.pipe(
      takeUntil(this.unsubscribe$))
      .subscribe(filters => {
        this.filterService.update({
          vm: filters.selectedVmId,
        });
      });
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }
}
