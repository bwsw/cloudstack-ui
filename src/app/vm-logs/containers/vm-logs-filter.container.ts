import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { State } from '../../reducers';
import { FilterService } from '../../shared/services/filter.service';
import { SessionStorageService } from '../../shared/services/session-storage.service';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';
import * as vmActions from '../../reducers/vm/redux/vm.actions';
import * as vmLogActions from '../redux/vm-logs.actions';
import * as fromVMs from '../../reducers/vm/redux/vm.reducers';
import * as fromVmLogsVm from '../redux/vm-logs-vm.reducers';
import * as fromVmLogs from '../redux/vm-logs.reducers';
import * as fromVmLogFiles from '../redux/vm-log-files.reducers';
import * as fromAccounts from '../../reducers/accounts/redux/accounts.reducers';
import { Keyword } from '../models/keyword.model';
import { Time } from '../../shared/components/time-picker/time-picker.component';
import { UserTagsSelectors } from '../../root-store';
import * as accountActions from '../../reducers/accounts/redux/accounts.actions';
import { combineLatest } from 'rxjs';
import moment = require('moment');
import { selectFilteredVMs } from '../redux/selectors/filtered-vms.selector';

const FILTER_KEY = 'logsFilters';

@Component({
  selector: 'cs-vm-logs-filter-container',
  template: `
    <cs-vm-logs-filter
      *loading="loading$ | async"
      [accounts]="accounts$ | async"
      [vms]="vms$ | async"
      [logFiles]="logFiles$ | async"
      [selectedAccountIds]="selectedAccountIds$ | async"
      [selectedVmId]="selectedVmId$ | async"
      [selectedLogFile]="selectedLogFile$ | async"
      [keywords]="keywords$ | async"
      [startDate]="startDate$ | async | csDateObjectToDate"
      [startTime]="startTime$ | async"
      [endDate]="endDate$ | async | csDateObjectToDate"
      [endTime]="endTime$ | async"
      [newestFirst]="newestFirst$ | async"
      [firstDayOfWeek]="firstDayOfWeek$ | async"
      (accountsChanged)="onAccountsChange($event)"
      (vmChanged)="onVmChange($event)"
      (logFileChanged)="onLogFileChange($event)"
      (refreshed)="onRefresh()"
      (keywordAdded)="onKeywordAdd($event)"
      (keywordRemoved)="onKeywordRemove($event)"
      (startDateChanged)="onStartDateChange($event)"
      (startTimeChanged)="onStartTimeChange($event)"
      (endDateChanged)="onEndDateChange($event)"
      (endTimeChanged)="onEndTimeChange($event)"
      (newestFirstChanged)="onNewestFirstChange($event)"
    ></cs-vm-logs-filter>`,
})
export class VmLogsFilterContainerComponent extends WithUnsubscribe()
  implements OnInit, AfterViewInit {
  readonly loading$ = this.store.pipe(select(fromVMs.isLoading));
  readonly accounts$ = this.store.pipe(select(fromAccounts.selectAll));
  readonly selectedAccountIds$ = this.store.pipe(select(fromVmLogsVm.filterSelectedAccountIds));
  readonly vms$ = this.store.pipe(select(selectFilteredVMs));
  readonly selectedVmId$ = this.store.pipe(select(fromVmLogsVm.filterSelectedVmId));
  readonly keywords$ = this.store.pipe(select(fromVmLogs.filterKeywords));
  readonly startDate$ = this.store.pipe(select(fromVmLogs.filterStartDate));
  readonly startTime$ = this.store.pipe(select(fromVmLogs.filterStartTime));
  readonly endDate$ = this.store.pipe(select(fromVmLogs.filterEndDate));
  readonly endTime$ = this.store.pipe(select(fromVmLogs.filterEndTime));
  readonly firstDayOfWeek$ = this.store.pipe(select(UserTagsSelectors.getFirstDayOfWeek));
  readonly newestFirst$ = this.store.pipe(select(fromVmLogs.filterNewestFirst));
  readonly selectedLogFile$ = this.store.pipe(select(fromVmLogs.filterSelectedLogFile));
  readonly logFiles$ = this.store.pipe(select(fromVmLogFiles.selectAll));

  private filterService = new FilterService(
    {
      vm: { type: 'string' },
      accounts: { type: 'array', defaultOption: [] },
      keywords: { type: 'array', defaultOption: [] },
      startDate: { type: 'string' },
      endDate: { type: 'string' },
      logFile: { type: 'string' },
      newestFirst: { type: 'boolean' },
    },
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

  public onKeywordAdd(keyword: Keyword) {
    this.store.dispatch(new vmLogActions.VmLogsAddKeyword(keyword));
  }

  public onKeywordRemove(keyword: Keyword) {
    this.store.dispatch(new vmLogActions.VmLogsRemoveKeyword(keyword));
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
    this.store.dispatch(new accountActions.LoadAccountsRequest());
    this.initFilters();

    combineLatest(
      this.keywords$,
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
      .subscribe(([keywords, startDate, endDate, vm, accounts, logFile, newestFirst]) => {
        this.filterService.update({
          vm,
          accounts,
          logFile,
          newestFirst,
          keywords: keywords.map(keyword => keyword.text),
          startDate: moment(startDate).toISOString(),
          endDate: moment(endDate).toISOString(),
        });
      });
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }

  private initFilters(): void {
    const {
      vm,
      keywords,
      accounts,
      startDate,
      endDate,
      logFile,
      newestFirst,
    } = this.filterService.getParams();

    this.store.dispatch(new vmLogActions.VmLogsUpdateVmId(vm));

    const wrappedKeywords = (keywords || []).map(text => ({ text }));
    this.store.dispatch(new vmLogActions.VmLogsUpdateKeywords(wrappedKeywords));
    this.store.dispatch(new vmLogActions.VmLogsUpdateAccountIds(accounts || []));
    this.store.dispatch(new vmLogActions.VmLogsUpdateNewestFirst(newestFirst));

    if (logFile) {
      this.store.dispatch(new vmLogActions.VmLogsUpdateLogFile(logFile));
    }

    if (startDate) {
      this.store.dispatch(new vmLogActions.VmLogsUpdateStartDateTime(moment(startDate).toObject()));
    }

    if (endDate) {
      this.store.dispatch(new vmLogActions.VmLogsUpdateEndDateTime(moment(endDate).toObject()));
    }
  }
}
