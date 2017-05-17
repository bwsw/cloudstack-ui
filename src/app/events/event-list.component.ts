import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MdlDefaultTableModel } from '@angular-mdl/core';
import { Observable } from 'rxjs/Observable';

import { dateTimeFormat, formatIso } from '../shared/components/date-picker/dateUtils';
import { LanguageService } from '../shared/services';
import { Event } from './event.model';
import { EventService } from './event.service';


@Component({
  selector: 'cs-event-list',
  templateUrl: 'event-list.component.html',
  styleUrls: ['event-list.component.scss']
})
export class EventListComponent implements OnInit {
  public loading = false;
  public tableModel: MdlDefaultTableModel;

  public events: Array<Event>;

  public date;

  public dateTimeFormat;
  public locale;
  public firstDayOfWeek: number;

  public selectedLevels: Array<string>;
  public levels = [
    'INFO',
    'WARN',
    'ERROR'
  ];

  constructor(
    private eventService: EventService,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    this.selectedLevels = [];

    this.locale = this.translate.currentLang;
    this.firstDayOfWeek = this.locale === 'en' ? 0 : 1;

    if (this.translate.currentLang === 'en') {
      this.dateTimeFormat = dateTimeFormat;
    }
    if (this.translate.currentLang === 'ru') {
      this.dateTimeFormat = Intl.DateTimeFormat;
    }

    this.updateEvents = this.updateEvents.bind(this);
  }

  public ngOnInit(): void {
    this.translate.get(['DESCRIPTION', 'LEVEL', 'TYPE', 'TIME'])
      .subscribe(translations => this.initTableModel(translations));

    this.languageService.getFirstDayOfWeek()
      .subscribe(day => this.firstDayOfWeek = day);
  }

  public filterEvents(): void {
    const params = {
      startDate: formatIso(this.date),
      endDate: formatIso(this.date)
    };

    const selectedLevels = this.selectedLevels;

    this.loading = true;

    if (selectedLevels.length > 1 && selectedLevels.length < this.levels.length) {
      const obs = selectedLevels
        .map(level => this.eventService.getList(Object.assign({}, params, { level })));

      Observable.forkJoin(obs)
        .subscribe(results => {
          this.events = [].concat.apply([], results);
          this.updateEvents(this.events);
        });
      return;
    }

    if (selectedLevels.length === 1) {
      params['level'] = this.selectedLevels[0];
    }

    this.eventService.getList(params)
      .subscribe(this.updateEvents);
  }

  private initTableModel(translations: any): void {
    this.tableModel = new MdlDefaultTableModel([
      { key: 'description', name: translations['DESCRIPTION'] },
      { key: 'level', name: translations['LEVEL'] },
      { key: 'type', name: translations['TYPE'] },
      { key: 'time', name: translations['TIME'] }
    ]);
  }

  private updateEvents(events): void {
    this.loading = false;
    this.events = events;
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
    this.tableModel.data = this.events.map(event => Object.assign({}, event, {
      selected: false,
      time: dateTimeFormat.format(new Date(event.created))
    }));
  }
}
