import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { formatIso } from '../shared/components/date-picker/dateUtils';
import { DateTimeFormatterService } from '../shared/services/date-time-formatter.service';
import { FilterService } from '../shared/services/filter.service';
import { Language, LanguageService } from '../shared/services/language.service';
import { SessionStorageService } from '../shared/services/session-storage.service';
import { Event } from './event.model';
import { EventService } from './event.service';


@Component({
  selector: 'cs-event-list',
  templateUrl: 'event-list.component.html',
  styleUrls: ['event-list.component.scss']
})
export class EventListComponent implements OnInit {

  readonly firstDayOfWeek$ = this.languageService.getFirstDayOfWeek();

  public loading = false;
  public tableColumns: Array<string>;
  public tableModel: Array<Event>;
  public visibleEvents: Array<Event>;
  public date;
  public events: Array<Event>;
  public selectedLevels: Array<string>;
  public selectedTypes: Array<string>;
  public query: string;
  public eventTypes: Array<string>;
  public levels = ['INFO', 'WARN', 'ERROR'];
  private filtersKey = 'eventListFilters';
  private filterService = new FilterService(
    {
      'date': { type: 'string' },
      'levels': { type: 'array', options: this.levels, defaultOption: [] },
      'types': { type: 'array', defaultOption: [] },
      'query': { type: 'string' }
    },
    this.router,
    this.sessionStorage,
    this.filtersKey,
    this.activatedRoute
  );

  constructor(
    public dateTimeFormatterService: DateTimeFormatterService,
    private languageService: LanguageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private eventService: EventService,
    private sessionStorage: SessionStorageService,
    private translate: TranslateService
  ) {
    this.updateEvents = this.updateEvents.bind(this);
    // this.languageService.initializeFirstDayOfWeek();
  }

  public ngOnInit(): void {
    this.initTableModel();
    this.initFilters();
    this.getEvents({ reload: true });
  }

  public get locale(): Language {
    return this.translate.currentLang as Language;
  }

  public getEvents(params = { reload: false }): void {
    if (params.reload) {
      this.loading = true;
    }
    this.getEventsObservable(params)
      .finally(() => this.loading = false)
      .subscribe();
  }

  public getEventsObservable(params: { reload: boolean }): Observable<Array<Event>> {
    const dateParams = {
      startDate: formatIso(this.date),
      endDate: formatIso(this.date)
    };

    const eventObservable = this.events && !params.reload
      ? Observable.of(this.events)
      : this.eventService.getList(dateParams);

    return eventObservable
      .do(events => this.updateEventTypes(events))
      .map(events => this.filterByLevel(events))
      .map(events => this.filterByType(events))
      .map(events => this.filterBySearch(events))
      .do(events => {
        this.updateQueryParams();
        this.updateEvents(events);
      });
  }

  private filterByLevel(events: Array<Event>): Array<Event> {
    return events.filter(event => {
      return !this.selectedLevels.length ||
        this.selectedLevels.length &&
        this.selectedLevels.includes(event.level);
    });
  }

  private filterByType(events: Array<Event>): Array<Event> {
    return events.filter(event => {
      return !this.selectedTypes.length ||
        this.selectedTypes.length &&
        this.selectedTypes.includes(event.type);
    });
  }

  private filterBySearch(events: Array<Event>): Array<Event> {
    if (!this.query) {
      return events;
    }

    const queryLower = this.query.toLowerCase();
    return events.filter((event: Event) => {
      return event.description.toLowerCase().includes(queryLower) ||
        event.level.toLowerCase().includes(queryLower) ||
        event.type.toLowerCase().includes(queryLower) ||
        this.dateTimeFormatterService.stringifyToTime(event.created)
          .toLowerCase()
          .includes(queryLower);
    });
  }

  private updateQueryParams(): void {
    this.filterService.update(this.filtersKey, {
      'date': moment(this.date).format('YYYY-MM-DD'),
      'levels': this.selectedLevels,
      'types': this.selectedTypes,
      'query': this.query
    });
  }

  private updateEventTypes(events: Array<Event>): void {
    this.eventTypes = this.getEventTypes(events);
  }

  private initFilters(): void {
    const params = this.filterService.getParams();

    this.date = moment(params['date']).toDate();
    this.selectedLevels = params['levels'];
    this.selectedTypes = params['types'];
    this.query = params['query'];
  }

  private getEventTypes(events: Array<Event>): Array<string> {
    const types = events.reduce((acc, event) => {
      if (!acc.includes(event.type)) {
        acc.push(event.type);
      }
      return acc;
    }, []);

    return this.selectedTypes.reduce((acc, type) => {
      if (!acc.includes(type)) {
        acc.push(type);
      }
      return acc;
    }, types);
  }

  private initTableModel(): void {
    this.tableColumns = ['description', 'level', 'type', 'time'];
  }

  private updateEvents(events: Array<Event>): void {
    this.visibleEvents = events;
    this.createTableModel();
  }

  private createTableModel(): void {
    this.tableModel = this.visibleEvents.map(event => Object.assign({}, event, {
      selected: false,
      time: this.dateTimeFormatterService.stringifyToTime(event.created)
    }));
  }
}
