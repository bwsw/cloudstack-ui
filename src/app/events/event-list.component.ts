import { MdlDefaultTableModel } from '@angular-mdl/core';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

import { FilterService } from '../shared';
import { formatIso } from '../shared/components/date-picker/dateUtils';
import { Event } from './event.model';
import { EventService } from './event.service';
import { DateTimeFormatterService } from '../shared/services/date-time-formatter.service';
import moment = require('moment');


@Component({
  selector: 'cs-event-list',
  templateUrl: 'event-list.component.html',
  styleUrls: ['event-list.component.scss']
})
export class EventListComponent implements OnInit {
  public loading = false;
  public tableModel: MdlDefaultTableModel;

  public visibleEvents: Array<Event>;

  public date;

  public events: Array<Event>;
  public selectedLevels: Array<string>;
  public selectedTypes: Array<string>;
  public query: string;

  public eventTypes: Array<string>;
  public levels = ['INFO', 'WARN', 'ERROR'];


  private filtersKey = 'eventListFilters';

  constructor(
    private dateService: DateTimeFormatterService,
    private eventService: EventService,
    private filterService: FilterService,
    private translate: TranslateService
  ) {
    this.updateEvents = this.updateEvents.bind(this);
  }

  public ngOnInit(): void {
    this.translate.get(['DESCRIPTION', 'LEVEL', 'TYPE', 'TIME'])
      .subscribe(translations => this.initTableModel(translations));
    this.initFilters();

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
        this.dateService.stringifyDate(event.created).toLowerCase().includes(queryLower);
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
      time: this.dateService.stringifyDate(event.created)
    }));
  }
}
