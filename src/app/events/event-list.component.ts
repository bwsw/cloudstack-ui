import { Component, OnInit } from '@angular/core';
import { MdlDefaultTableModel } from 'angular2-mdl';
import { TranslateService } from 'ng2-translate';

import { EventService } from './event.service';
import { Event } from './event.model';


@Component({
  selector: 'cs-event-list',
  templateUrl: 'event-list.component.html',
  styleUrls: ['event-list.component.scss']
})
export class EventListComponent implements OnInit {
  public loading = false;
  public tableModel: MdlDefaultTableModel;

  public events: Array<Event>;

  constructor(
    private eventService: EventService,
    private translate: TranslateService
  ) { }

  public ngOnInit(): void {
    this.translate.get(['DESCRIPTION', 'LEVEL', 'TYPE'])
      .subscribe(translations => this.initTableModel(translations));

    // yyyy-MM-dd
    const currentDate = (new Date()).toISOString().substring(0, 10);

    this.loading = true;
    this.eventService.getList({
      startDate: currentDate,
      endDate: currentDate // only current date for now
    })
      .subscribe(events => {
        this.loading = false;
        this.events = events;
        this.createTableModel();
      });
  }

  private initTableModel(translations: any): void {
    this.tableModel = new MdlDefaultTableModel([
      { key: 'description', name: translations['DESCRIPTION'] },
      { key: 'level', name: translations['LEVEL'] },
      { key: 'type', name: translations['TYPE'] }
    ]);
  }

  private createTableModel(): void {
    const tableData = this.events.map(event => Object.assign({}, event, { selected: false }));
    this.tableModel.addAll(tableData);
  }
}
