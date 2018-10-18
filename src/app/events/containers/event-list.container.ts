import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { map, takeUntil, withLatestFrom } from 'rxjs/operators';
import * as debounce from 'lodash/debounce';

import { State, UserTagsSelectors } from '../../root-store';
import * as eventAction from '../redux/events.actions';
import * as accountAction from '../../reducers/accounts/redux/accounts.actions';
import { FilterService } from '../../shared/services/filter.service';
import { SessionStorageService } from '../../shared/services/session-storage.service';
import * as fromEvents from '../redux/events.reducers';
import * as fromAccounts from '../../reducers/accounts/redux/accounts.reducers';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';
import { AuthService } from '../../shared/services/auth.service';
import moment = require('moment');

const FILTER_KEY = 'eventListFilters';

@Component({
  selector: 'cs-event-list-container',
  template: `
    <cs-event-list
      [events]="events$ | async"
      [isLoading]="loading$ | async"
      [firstDayOfWeek]="firstDayOfWeek$ | async"
      [eventTypes]="eventTypes$ | async"
      [selectedLevels]="selectedLevels$ | async"
      [selectedTypes]="selectedTypes$ | async"
      [date]="date$ | async"
      [query]="query$ | async"
      [accounts]="accounts$ | async"
      [isAdmin]="isAdmin()"
      [selectedAccountIds]="selectedAccountIds$ | async"
      (accountChanged)="onAccountChange($event)"
      (dateChange)="onDateChange($event)"
      (queryChanged)="onQueryChange($event)"
      (eventTypesChanged)="onEventTypesChange($event)"
      (selectedLevelsChanged)="onSelectedLevelsChange($event)"
    ></cs-event-list>`,
})
export class EventListContainerComponent extends WithUnsubscribe() implements OnInit {
  readonly firstDayOfWeek$ = this.store.pipe(select(UserTagsSelectors.getFirstDayOfWeek));
  readonly events$ = this.store.pipe(select(fromEvents.selectFilteredEvents));
  readonly accounts$ = this.store.pipe(select(fromAccounts.selectAll));
  readonly query$ = this.store.pipe(select(fromEvents.filterQuery));
  readonly loading$ = this.store.pipe(select(fromEvents.isLoading));
  readonly filters$ = this.store.pipe(select(fromEvents.filters));
  readonly selectedTypes$ = this.store.pipe(select(fromEvents.filterSelectedTypes));
  readonly selectedLevels$ = this.store.pipe(select(fromEvents.filterSelectedLevels));
  readonly selectedAccountIds$ = this.store.pipe(select(fromEvents.filterSelectedAccountIds));
  readonly eventTypes$ = this.store.pipe(
    select(fromEvents.eventTypes),
    withLatestFrom(this.selectedTypes$),
    map(([all, selected]) => {
      const set = new Set(all.concat(selected));
      return [...Array.from(set)];
    }),
  );
  readonly date$ = this.store.pipe(select(fromEvents.filterDate));

  public levels = ['INFO', 'WARN', 'ERROR'];

  private filterService = new FilterService(
    {
      date: { type: 'string' },
      levels: { type: 'array', options: this.levels, defaultOption: [] },
      types: { type: 'array', defaultOption: [] },
      accounts: { type: 'array', defaultOption: [] },
      query: { type: 'string' },
    },
    this.router,
    this.sessionStorage,
    FILTER_KEY,
    this.activatedRoute,
  );

  constructor(
    private store: Store<State>,
    private sessionStorage: SessionStorageService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {
    super();

    this.onQueryChange = debounce(this.onQueryChange.bind(this), 500);
  }

  public isAdmin() {
    return this.authService.isAdmin();
  }

  public onQueryChange(query: string) {
    this.store.dispatch(new eventAction.EventFilterUpdate({ query }));
  }

  public onEventTypesChange(selectedTypes: string[]) {
    this.store.dispatch(new eventAction.EventFilterUpdate({ selectedTypes }));
  }

  public onSelectedLevelsChange(selectedLevels: string[]) {
    this.store.dispatch(new eventAction.EventFilterUpdate({ selectedLevels }));
  }

  public onAccountChange(selectedAccountIds: string[]) {
    this.store.dispatch(new eventAction.EventFilterUpdate({ selectedAccountIds }));
  }

  public onDateChange(date: Date) {
    this.store.dispatch(new eventAction.EventFilterUpdate({ date }));
  }

  public ngOnInit() {
    this.store.dispatch(new accountAction.LoadAccountsRequest());

    this.initFilters();
    this.filters$.pipe(takeUntil(this.unsubscribe$)).subscribe(filters => {
      this.filterService.update({
        date: moment(filters.date).format('YYYY-MM-DD'),
        levels: filters.selectedLevels,
        types: filters.selectedTypes,
        accounts: filters.selectedAccountIds,
        query: filters.query,
      });
    });
  }

  private initFilters(): void {
    const params = this.filterService.getParams();

    const date = moment(params['date']).toDate();
    const selectedLevels = params['levels'];
    const selectedTypes = params['types'];
    const query = params['query'];
    const selectedAccountIds = params['accounts'];

    this.store.dispatch(
      new eventAction.EventFilterUpdate({
        query,
        date,
        selectedTypes,
        selectedLevels,
        selectedAccountIds,
      }),
    );
  }
}
