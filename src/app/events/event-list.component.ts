import { Component, OnInit } from '@angular/core';
import { MdlDefaultTableModel } from 'angular2-mdl';
import { TranslateService } from '@ngx-translate/core';

import { EventService } from './event.service';
import { Event } from './event.model';
import { dateTimeFormat, formatIso } from '../shared/components/date-picker/dateUtils';
import { FilterService } from '../shared/services/filter.service';

import moment = require('moment');

@Component({
  selector: 'cs-event-list',
  templateUrl: 'event-list.component.html',
  styleUrls: ['event-list.component.scss']
})
export class EventListComponent implements OnInit {
  public loading = false;
  public tableModel: MdlDefaultTableModel;

  public events: Array<Event>;
  public visibleEvents: Array<Event>;

  public date;
  public dateTimeFormat;
  public locale;

  public selectedLevels: Array<string>;
  public selectedTypes: Array<string>;
  public eventTypes: Array<string>;
  public levels = [
    'INFO',
    'WARN',
    'ERROR'
  ];

  private filtersKey = 'eventListFilters';

  constructor(
    private eventService: EventService,
    private filterService: FilterService,
    private translate: TranslateService,
  ) {
    this.selectedLevels = [];
    this.selectedTypes = [];

    this.locale = this.translate.currentLang;

    this.updateEvents = this.updateEvents.bind(this);
  }

  public ngOnInit(): void {
    this.setDateTimeFormat();
    this.translate.onLangChange.subscribe(() => this.setDateTimeFormat());
    this.translate.get(['DESCRIPTION', 'LEVEL', 'TYPE', 'TIME'])
      .subscribe(translations => this.initTableModel(translations));
    this.initFilters();
  }

  public initFilters(): void {
    const params = this.filterService.init(this.filtersKey, {
      'date': { type: 'string' },
      'levels': { type: 'array', options: this.levels, defaultOption: [] },
      'types': { type: 'array', defaultOption: [] }
    });

    this.date = moment(params['date']).toDate();
    this.selectedLevels = this.levels.filter(level => params['levels'].includes(level));
    this.selectedTypes = this.eventTypes.filter(type => params['types'].includes(type));

    this.getEvents();
  }

  public getEvents(): void {
    this.loading = true;

    const params = {
      startDate: formatIso(this.date),
      endDate: formatIso(this.date)
    };

    this.eventService.getList(params)
      .subscribe(events => {
        this.events = events;
        this.getEventTypes();
        this.filter();
        this.updateEvents();
        this.loading = false;
      });
  }

  public filter(): void {
    this.visibleEvents = this.events.filter(event => {
      const levelFilter =
        !this.selectedLevels.length ||
        (this.selectedLevels.length && this.selectedLevels.includes(event.level));

      const typeFilter =
        !this.selectedTypes.length ||
        (this.selectedTypes.length && this.selectedTypes.includes(event.type));

      return levelFilter && typeFilter;
    });
    this.updateEvents();
  }

  private setDateTimeFormat(): void {
    if (this.translate.currentLang === 'en') {
      this.dateTimeFormat = dateTimeFormat;
    }
    if (this.translate.currentLang === 'ru') {
      this.dateTimeFormat = Intl.DateTimeFormat;
    }
  }

  private getEventTypes(): void {
    this.eventTypes = this.events.reduce((acc, event) => {
      if (!acc.includes(event.type)) {
        acc.push(event.type);
      }
      return acc;
    }, []);
  }

  private initTableModel(translations: any): void {
    this.tableModel = new MdlDefaultTableModel([
      { key: 'description', name: translations['DESCRIPTION'] },
      { key: 'level', name: translations['LEVEL'] },
      { key: 'type', name: translations['TYPE'] },
      { key: 'time', name: translations['TIME'] }
    ]);
  }

  private updateEvents(): void {
    this.loading = false;
    this.createTableModel();
  }

  private createTableModel(): void {
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short'
    };
    const dateTimeFormat = new Intl.DateTimeFormat(this.locale, options);
    this.tableModel.data = this.visibleEvents.map(event => Object.assign({}, event, {
      selected: false,
      time: dateTimeFormat.format(new Date(event.created))
    }));
  }
}
