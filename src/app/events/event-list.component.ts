import { Component, OnInit } from '@angular/core';
import { MdlDefaultTableModel } from 'angular2-mdl';
import { EventService } from './event.service';
import { Event } from './event.model';


@Component({
  selector: 'cs-event-list',
  templateUrl: 'event-list.component.html',
  styleUrls: ['event-list.component.scss']
})
export class EventListComponent implements OnInit {
  public loading = false;
  public tableModel = new MdlDefaultTableModel([
    { key: 'description', name: 'Description' },
    { key: 'level', name: 'Level' },
    { key: 'type', name: 'Type' }
  ]);

  public events: Array<Event>;

  constructor(private eventService: EventService) { }

  public ngOnInit(): void {
    // yyyy-MM-dd
    const currentDate = (new Date()).toISOString().substring(0, 10);

    this.loading = true;
    this.eventService.getList({
      startDate: currentDate, endDate: currentDate // only current date for now
    })
      .subscribe(events => {
        this.loading = false;
        this.events = events;
        this.createTableModel();
      });
  }

  private createTableModel(): void {
    const tableData = this.events.map(event => Object.assign({}, event, { selected: false }));
    this.tableModel.addAll(tableData);
  }
}
