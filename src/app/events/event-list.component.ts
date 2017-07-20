import { MdlDefaultTableModel } from '@angular-mdl/core';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

import { FilterService } from '../shared';
import { dateTimeFormat, formatIso } from '../shared/components/date-picker/dateUtils';
import { LanguageService } from '../shared/services';
import { TimeFormat } from '../shared/services/language.service';
import { Event } from './event.model';
import { EventService } from './event.service';
import { WithUnsubscribe } from '../utils/mixins/with-unsubscribe';

import moment = require('moment');


@Component({
  selector: 'cs-event-list',
  templateUrl: 'event-list.component.html',
  styleUrls: ['event-list.component.scss']
})
export class EventListComponent extends WithUnsubscribe() implements OnInit {
  public loading = false;
  public tableModel: MdlDefaultTableModel;

  public visibleEvents: Array<Event>;

  public date;
  public dateTimeFormat;
  public dateStringifyDateTimeFormat;
  public firstDayOfWeek: number;
  public timeFormat: string;

  public events: Array<Event>;
  public selectedLevels: Array<string>;
  public selectedTypes: Array<string>;
  public query: string;

  public eventTypes: Array<string>;
  public levels = ['INFO', 'WARN', 'ERROR'];


  private filtersKey = 'eventListFilters';

  constructor(
    private eventService: EventService,
    private filterService: FilterService,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    super();
    this.firstDayOfWeek = this.locale === 'en' ? 0 : 1;
    this.updateEvents = this.updateEvents.bind(this);
  }

  public ngOnInit(): void {
    this.setDateTimeFormat();
    this.translate.onLangChange
      .takeUntil(this.unsubscribe$)
      .subscribe(() => this.setDateTimeFormat());
    this.translate.get(['DESCRIPTION', 'LEVEL', 'TYPE', 'TIME'])
      .subscribe(translations => this.initTableModel(translations));
    this.initFilters();

    Observable.forkJoin(
      this.languageService.getFirstDayOfWeek(),
      this.languageService.getTimeFormat()
    )
      .subscribe(([day, timeFormat]) => {
        this.firstDayOfWeek = day;
        this.timeFormat = timeFormat;
        this.setDateTimeFormat();

        this.getEvents({ reload: true });
      });
  }

  public get locale(): string {
    return this.translate.currentLang;
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

    const eventObservable = this.events && !params.reload ?
      Observable.of(this.events) :
      this.eventService.getList(dateParams);

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
        this.stringifyDate(event.created).toLowerCase().includes(queryLower);
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

  private stringifyDate(date: Date): string {
    return this.dateStringifyDateTimeFormat.format(date);
  }

  private updateEventTypes(events: Array<Event>): void {
    this.eventTypes = this.getEventTypes(events);
  }

  private initFilters(): void {
    const params = this.filterService.init(this.filtersKey, {
      'date': { type: 'string' },
      'levels': { type: 'array', options: this.levels, defaultOption: [] },
      'types': { type: 'array', defaultOption: [] },
      'query': { type: 'string' }
    });

    this.date = moment(params['date']).toDate();
    this.selectedLevels = params['levels'];
    this.selectedTypes = params['types'];
    this.query = params['query'];
  }

  private setDateTimeFormat(): void {
    if (this.translate.currentLang === 'en') {
      this.dateTimeFormat = dateTimeFormat;
    }
    if (this.translate.currentLang === 'ru') {
      this.dateTimeFormat = Intl.DateTimeFormat;
    }

    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short'
    };

    if (this.timeFormat !== TimeFormat.AUTO) {
      options.hour12 = this.timeFormat === TimeFormats.hour24;
    }
    this.dateStringifyDateTimeFormat = new Intl.DateTimeFormat(this.locale, options);
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

  private initTableModel(translations: any): void {
    this.tableModel = new MdlDefaultTableModel([
      { key: 'description', name: translations['DESCRIPTION'] },
      { key: 'level', name: translations['LEVEL'] },
      { key: 'type', name: translations['TYPE'] },
      { key: 'time', name: translations['TIME'] }
    ]);
  }

  private updateEvents(events: Array<Event>): void {
    this.visibleEvents = events;
    this.createTableModel();
  }

  private createTableModel(): void {
    this.tableModel.data = this.visibleEvents.map(event => Object.assign({}, event, {
      selected: false,
      time: this.stringifyDate(event.created)
    }));
  }
}
