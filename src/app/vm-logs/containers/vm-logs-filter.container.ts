import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { State } from '../../reducers';
import { FilterService } from '../../shared/services/filter.service';
import { SessionStorageService } from '../../shared/services/session-storage.service';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';
import * as vmActions from '../../reducers/vm/redux/vm.actions';
import * as vmLogActions from '../redux/vm-logs.actions';
import * as fromVMs from '../../reducers/vm/redux/vm.reducers';
import * as fromVmLogs from '../redux/vm-logs.reducers';
import * as fromAccounts from '../../reducers/accounts/redux/accounts.reducers';
import { Keyword } from '../models/keyword.model';
import { Time } from '../../shared/components/time-picker/time-picker.component';
import { UserTagsSelectors } from '../../root-store';
import moment = require('moment');
import * as accountActions from '../../reducers/accounts/redux/accounts.actions';

const FILTER_KEY = 'logsFilters';

@Component({
  selector: 'cs-vm-logs-filter-container',
  template: `
    <cs-vm-logs-filter
      *loading="loading$ | async"
      [accounts]="accounts$ | async"
      [vms]="vms$ | async"
      [selectedAccountIds]="selectedAccountIds$ | async"
      [selectedVmId]="selectedVmId$ | async"
      [keywords]="keywords$ | async"
      [startDate]="startDate$ | async | dateObjectToDate"
      [startTime]="startTime$ | async"
      [endDate]="endDate$ | async | dateObjectToDate"
      [endTime]="endTime$ | async"
      [newestFirst]="newestFirst$ | async"
      [firstDayOfWeek]="firstDayOfWeek$ | async"
      (onAccountsChange)="onAccountsChange($event)"
      (onVmChange)="onVmChange($event)"
      (onRefresh)="onRefresh()"
      (onKeywordAdd)="onKeywordAdd($event)"
      (onKeywordRemove)="onKeywordRemove($event)"
      (onStartDateChange)="onStartDateChange($event)"
      (onStartTimeChange)="onStartTimeChange($event)"
      (onEndDateChange)="onEndDateChange($event)"
      (onEndTimeChange)="onEndTimeChange($event)"
      (onNewestFirstChange)="onNewestFirstChange($event)"
    ></cs-vm-logs-filter>`
})
export class VmLogsFilterContainerComponent extends WithUnsubscribe() implements OnInit, AfterViewInit {
  readonly filters$ = this.store.pipe(select(fromVmLogs.filters));
  readonly loading$ = this.store.pipe(select(fromVMs.isLoading));
  readonly accounts$ = this.store.pipe(select(fromAccounts.selectAll));
  readonly selectedAccountIds$ = this.store.pipe(select(fromVmLogs.filterSelectedAccountIds));
  readonly vms$ = this.store.pipe(select(fromVmLogs.selectFilteredVMs));
  readonly selectedVmId$ = this.store.pipe(select(fromVmLogs.filterSelectedVmId));
  readonly keywords$ = this.store.pipe(select(fromVmLogs.filterKeywords));
  readonly startDate$ = this.store.pipe(select(fromVmLogs.filterStartDate));
  readonly startTime$ = this.store.pipe(select(fromVmLogs.filterStartTime));
  readonly endDate$ = this.store.pipe(select(fromVmLogs.filterEndDate));
  readonly endTime$ = this.store.pipe(select(fromVmLogs.filterEndTime));
  readonly firstDayOfWeek$ = this.store.pipe(select(UserTagsSelectors.getFirstDayOfWeek));
  readonly newestFirst$ = this.store.pipe(select(fromVmLogs.filterNewestFirst));

  private filterService = new FilterService(
    {
      vm: { type: 'string' },
      keywords: { type: 'array', defaultOption: [] },
      startDate: { type: 'string' },
      endDate: { type: 'string' },
      newestFirst: { type: 'boolean' }
    },
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

  public onAccountsChange(selectedAccountIds: Array<string>) {
    this.store.dispatch(new vmLogActions.VmLogsUpdateAccountIds(selectedAccountIds));
  }

  public onVmChange(selectedVmId: string) {
    this.store.dispatch(new vmLogActions.VmLogsFilterUpdate({
      selectedVmId
    }));
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

  public onNewestFirstChange() {
    this.store.dispatch(new vmLogActions.VmLogsToggleNewestFirst());
  }

  private initFilters(): void {
    const params = this.filterService.getParams();

    this.store.dispatch(new vmLogActions.VmLogsFilterUpdate({
      selectedVmId: params['vm'],
      keywords: (params['keywords'] || []).map(text => ({ text })),
      newestFirst: params['newestFirst'],
      selectedAccountIds: params['accounts'] || [],
      ...(params['startDate'] ? { startDate: moment(params['startDate']).toObject() } : null),
      ...(params['endDate'] ? { endDate: moment(params['endDate']).toObject() } : null)
    }));
  }

  public ngOnInit() {
    this.store.dispatch(new vmActions.LoadVMsRequest());
    this.store.dispatch(new accountActions.LoadAccountsRequest());
    this.initFilters();
    this.filters$.pipe(
      takeUntil(this.unsubscribe$),
      debounceTime(100)
    )
      .subscribe(filters => {
        this.filterService.update({
          vm: filters.selectedVmId,
          keywords: filters.keywords.map(keyword => keyword.text),
          accounts: filters.selectedAccountIds,
          newestFirst: filters.newestFirst,
          startDate: moment(filters.startDate).toISOString(),
          endDate: moment(filters.endDate).toISOString(),
        });
      });
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }
}