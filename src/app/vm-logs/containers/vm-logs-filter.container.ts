import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { debounceTime, takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { State } from '../../reducers';
import { FilterService } from '../../shared/services/filter.service';
import { SessionStorageService } from '../../shared/services/session-storage.service';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';
import * as vmActions from '../../reducers/vm/redux/vm.actions';
import * as vmLogActions from '../redux/vm-logs.actions';
import * as fromVMs from '../../reducers/vm/redux/vm.reducers';
import * as fromVmLogs from '../redux/vm-logs.reducers';
import * as fromVmLogFiles from '../redux/vm-log-files.reducers';
import * as fromAccounts from '../../reducers/accounts/redux/accounts.reducers';
import { Time } from '../../shared/components/time-picker/time-picker.component';
import { UserTagsSelectors } from '../../root-store';
import { combineLatest } from 'rxjs';
import { selectFilteredVMs } from '../redux/selectors/filtered-vms.selector';
import * as fromVmLogsAutoUpdate from '../redux/vm-logs-auto-update.reducers';
import { parseVmLogsFilters, vmLogsFilters } from '../vm-logs-filters';
import { UpdateVmLogsFilters } from '../../root-store/server-data/user-tags/user-tags.actions';

const FILTER_KEY = 'logsFilters';

@Component({
  selector: 'cs-vm-logs-filter-container',
  template: `
    <cs-vm-logs-filter
      *loading="(loading$ | async)"
      [accounts]="accounts$ | async"
      [vms]="vms$ | async"
      [logFiles]="logFiles$ | async"
      [selectedAccountIds]="selectedAccountIds$ | async"
      [selectedVmId]="selectedVmId$ | async"
      [selectedLogFile]="selectedLogFile$ | async"
      [search]="search$ | async"
      [startDate]="startDate$ | async | csDateObjectToDate"
      [startTime]="startTime$ | async"
      [endDate]="endDate$ | async | csDateObjectToDate"
      [endTime]="endTime$ | async"
      [newestFirst]="newestFirst$ | async"
      [isAutoUpdateEnabled]="isAutoUpdateEnabled$ | async"
      [firstDayOfWeek]="firstDayOfWeek$ | async"
      [timeFormat]="timeFormat$ | async"
      (accountsChanged)="onAccountsChange($event)"
      (vmChanged)="onVmChange($event)"
      (logFileChanged)="onLogFileChange($event)"
      (refreshed)="onRefresh()"
      (searchChanged)="onSearchChange($event)"
      (startDateChanged)="onStartDateChange($event)"
      (startTimeChanged)="onStartTimeChange($event)"
      (endDateChanged)="onEndDateChange($event)"
      (endTimeChanged)="onEndTimeChange($event)"
      (newestFirstChanged)="onNewestFirstChange($event)"
    ></cs-vm-logs-filter>
  `,
})
export class VmLogsFilterContainerComponent extends WithUnsubscribe()
  implements OnInit, AfterViewInit {
  readonly loading$ = this.store.pipe(select(fromVMs.isLoading));
  readonly accounts$ = this.store.pipe(select(fromAccounts.selectAll));
  readonly selectedAccountIds$ = this.store.pipe(select(fromVmLogs.filterSelectedAccountIds));
  readonly vms$ = this.store.pipe(select(selectFilteredVMs));
  readonly selectedVmId$ = this.store.pipe(select(fromVmLogs.filterSelectedVmId));
  readonly search$ = this.store.pipe(select(fromVmLogs.filterSearch));
  readonly startDate$ = this.store.pipe(select(fromVmLogs.filterStartDate));
  readonly startTime$ = this.store.pipe(select(fromVmLogs.filterStartTime));
  readonly endDate$ = this.store.pipe(select(fromVmLogs.filterEndDate));
  readonly endTime$ = this.store.pipe(select(fromVmLogs.filterEndTime));
  readonly firstDayOfWeek$ = this.store.pipe(select(UserTagsSelectors.getFirstDayOfWeek));
  readonly newestFirst$ = this.store.pipe(select(fromVmLogs.filterNewestFirst));
  readonly selectedLogFile$ = this.store.pipe(select(fromVmLogs.filterSelectedLogFile));
  readonly logFiles$ = this.store.pipe(select(fromVmLogFiles.selectAll));
  readonly isAutoUpdateEnabled$ = this.store.pipe(
    select(fromVmLogsAutoUpdate.selectIsAutoUpdateEnabled),
  );
  readonly timeFormat$ = this.store.pipe(select(UserTagsSelectors.getTimeFormat));

  private filterService = new FilterService(
    vmLogsFilters,
    this.router,
    this.sessionStorage,
    FILTER_KEY,
    this.activatedRoute,
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

  public onAccountsChange(selectedAccountIds: string[]) {
    this.store.dispatch(new vmLogActions.VmLogsUpdateAccountIds(selectedAccountIds));
  }

  public onVmChange(selectedVmId: string) {
    this.store.dispatch(new vmLogActions.VmLogsUpdateVmId(selectedVmId));
  }

  public onRefresh() {
    this.store.dispatch(new vmLogActions.LoadVmLogsRequest());
  }

  public onSearchChange(search: string) {
    this.store.dispatch(new vmLogActions.VmLogsUpdateSearch(search));
  }

  public onStartDateChange(date: Date) {
    this.store.dispatch(new vmLogActions.VmLogsUpdateStartDate(date));
  }

  public onStartTimeChange(time: Time) {
    this.store.dispatch(new vmLogActions.VmLogsUpdateStartTime(time));
  }

  public onEndDateChange(date: Date) {
    this.store.dispatch(new vmLogActions.VmLogsUpdateEndDate(date));
  }

  public onEndTimeChange(time: Time) {
    this.store.dispatch(new vmLogActions.VmLogsUpdateEndTime(time));
  }

  public onLogFileChange(logFile: string) {
    this.store.dispatch(new vmLogActions.VmLogsUpdateLogFile(logFile));
  }

  public onNewestFirstChange() {
    this.store.dispatch(new vmLogActions.VmLogsToggleNewestFirst());
  }

  public ngOnInit() {
    this.store.dispatch(new vmActions.LoadVMsRequest());
    this.initFilters();

    combineLatest(
      this.search$,
      this.startDate$,
      this.endDate$,
      this.selectedVmId$,
      this.selectedAccountIds$,
      this.selectedLogFile$,
      this.newestFirst$,
    )
      .pipe(
        takeUntil(this.unsubscribe$),
        debounceTime(100),
      )
      .subscribe(([search, startDate, endDate, vm, accounts, logFile, newestFirst]) => {
        const serializedFilters = {
          vm,
          accounts,
          logFile,
          newestFirst,
          search,
          startDate: moment(startDate).toISOString(),
          endDate: moment(endDate).toISOString(),
        };

        this.store.dispatch(new UpdateVmLogsFilters(serializedFilters));
        this.filterService.update(serializedFilters);
      });
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }

  private initFilters(): void {
    const filters = this.filterService.getParams();
    const parsedFilters = parseVmLogsFilters(filters);
    this.store.dispatch(new vmLogActions.UpdateFilters(parsedFilters));
  }
}
