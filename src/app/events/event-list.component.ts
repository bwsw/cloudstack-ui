import { Component, OnInit } from '@angular/core';
import { MdlDefaultTableModel } from 'angular2-mdl';
import { TranslateService } from 'ng2-translate';

import { EventService } from './event.service';
import { Event } from './event.model';
import { Observable } from 'rxjs';


@Component({
  selector: 'cs-event-list',
  templateUrl: 'event-list.component.html',
  styleUrls: ['event-list.component.scss']
})
export class EventListComponent implements OnInit {
  public loading = false;
  public tableModel: MdlDefaultTableModel;

  public events: Array<Event>;

  public selectedLevels: Array<string>;
  public levels = [
    'INFO',
    'WARN',
    'ERROR'
  ];

  constructor(
    private eventService: EventService,
    private translate: TranslateService
  ) {
    this.selectedLevels = this.levels.concat();

    this.updateEvents = this.updateEvents.bind(this);
  }

  public ngOnInit(): void {
    this.translate.get(['DESCRIPTION', 'LEVEL', 'TYPE'])
      .subscribe(translations => this.initTableModel(translations));

    this.filterByLevel(this.selectedLevels);
  }

  public filterByLevel(levels: Array<string>): void {
    // yyyy-MM-dd
    const currentDate = (new Date()).toISOString().substring(0, 10);
    const params = {
      startDate: currentDate,
      endDate: currentDate // only current date for now
    };

    if (!levels.length) {
      this.events = [];
      return;
    }

    this.loading = true;

    if (levels.length !== 1 && levels.length !== this.levels.length) {
      const obs = levels.map(level => this.eventService.getList(Object.assign({}, params, { level })));

      Observable.forkJoin(obs)
        .subscribe(results => {
          this.events = [].concat.apply([], results);
          this.updateEvents(this.events);
        });
      return;
    }

    if (levels.length === 1) {
      params['level'] = levels[0];
    }

    this.eventService.getList(params)
      .subscribe(this.updateEvents);
  }

  private initTableModel(translations: any): void {
    this.tableModel = new MdlDefaultTableModel([
      { key: 'description', name: translations['DESCRIPTION'] },
      { key: 'level', name: translations['LEVEL'] },
      { key: 'type', name: translations['TYPE'] }
    ]);
  }

  private updateEvents(events): void {
    this.loading = false;
    this.events = events;
    this.createTableModel();
  }

  private createTableModel(): void {
    this.tableModel.data = this.events.map(event => Object.assign({}, event, {selected: false}));
  }
}
