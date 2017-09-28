import { Component, OnInit } from '@angular/core';
import { State } from '../../reducers/index';
import { Store } from '@ngrx/store';
import * as event from '../redux/events.actions';
import * as debounce from 'lodash/debounce';
import moment = require('moment');
import { FilterService } from '../../shared/services/filter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionStorageService } from '../../shared/services/session-storage.service';
import * as fromEvents from '../redux/events.reducers';
import { LanguageService } from '../../shared/services/language.service';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';

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
      (onDateChange)="onDateChange($event)"
      (onQueryChange)="onQueryChange($event)"
      (onEventTypesChange)="onEventTypesChange($event)"
      (onSelectedLevelsChange)="onSelectedLevelsChange($event)"
    ></cs-event-list>`
})
export class EventListContainerComponent extends WithUnsubscribe() implements OnInit {

  readonly firstDayOfWeek$ = this.languageService.getFirstDayOfWeek();
  readonly events$ = this.store.select(fromEvents.selectFilteredEvents);
  readonly query$ = this.store.select(fromEvents.filterQuery);
  readonly loading$ = this.store.select(fromEvents.isLoading);
  readonly filters$ = this.store.select(fromEvents.filters);
  readonly selectedTypes$ = this.store.select(fromEvents.filterSelectedTypes);
  readonly selectedLevels$ = this.store.select(fromEvents.filterSelectedLevels);
  readonly eventTypes$ = this.store.select(fromEvents.eventTypes)
    .withLatestFrom(this.selectedTypes$)
    .map(([all, selected]) => {
      const set = new Set(all.concat(selected));
      return [...Array.from(set)];
    });
  readonly date$ = this.store.select(fromEvents.filterDate);

  public levels = ['INFO', 'WARN', 'ERROR'];

  private filterService = new FilterService(
    {
      'date': { type: 'string' },
      'levels': { type: 'array', options: this.levels, defaultOption: [] },
      'types': { type: 'array', defaultOption: [] },
      'query': { type: 'string' }
    },
    this.router,
    this.sessionStorage,
    'eventListFilters',
    this.activatedRoute
  );

  constructor(
    private store: Store<State>,
    private sessionStorage: SessionStorageService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private languageService: LanguageService
  ) {
    super();

    this.onQueryChange = debounce(this.onQueryChange.bind(this), 500);
  }

  public onQueryChange(query) {
    this.store.dispatch(new event.EventFilterUpdate({ query }));
  }

  public onEventTypesChange(selectedTypes) {
    this.store.dispatch(new event.EventFilterUpdate({ selectedTypes }));
  }

  public onSelectedLevelsChange(selectedLevels) {
    this.store.dispatch(new event.EventFilterUpdate({ selectedLevels }));
  }

  public onDateChange(date) {
    this.store.dispatch(new event.EventFilterUpdate({ date }));

  }

  public ngOnInit() {
    this.initFilters();
    this.filters$
      .takeUntil(this.unsubscribe$)
      .subscribe(filters => {
        this.filterService.update({
          'date': moment(filters.date).format('YYYY-MM-DD'),
          'levels': filters.selectedLevels,
          'types': filters.selectedTypes,
          'query': filters.query
        });
      });
  }

  private initFilters(): void {
    const params = this.filterService.getParams();

    const date = moment(params['date']).toDate();
    const selectedLevels = params['levels'];
    const selectedTypes = params['types'];
    const query = params['query'];
    this.store.dispatch(new event.EventFilterUpdate({
      query,
      date,
      selectedTypes,
      selectedLevels
    }));
  }

}
