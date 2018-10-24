import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

import { Event } from '../event.model';
import { DateTimeFormatterService } from '../../shared/services/date-time-formatter.service';
import { Account } from '../../shared/models/account.model';
import { Language } from '../../shared/types';

@Component({
  selector: 'cs-event-list',
  templateUrl: 'event-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['event-list.component.scss'],
})
export class EventListComponent implements OnChanges {
  @Input()
  public events: Event[] = [];
  @Input()
  public selectedTypes: string[] = [];
  @Input()
  public selectedLevels: string[] = [];
  @Input()
  public eventTypes: string[] = [];
  @Input()
  public firstDayOfWeek: number;
  @Input()
  public isLoading = false;
  @Input()
  public date: Date;
  @Input()
  public query: string;
  @Input()
  public accounts: Account[] = [];
  @Input()
  public selectedAccountIds: string[] = [];
  @Input()
  public isAdmin: boolean;
  @Output()
  public dateChange = new EventEmitter<Date>();
  @Output()
  public queryChanged = new EventEmitter<string>();
  @Output()
  public eventTypesChanged = new EventEmitter<string[]>();
  @Output()
  public selectedLevelsChanged = new EventEmitter<string[]>();
  @Output()
  public accountChanged = new EventEmitter<string[]>();

  public dataSource: MatTableDataSource<Event>;
  public tableColumns = ['description', 'level', 'type', 'time'];
  public levels = ['INFO', 'WARN', 'ERROR'];

  constructor(
    public dateTimeFormatterService: DateTimeFormatterService,
    public translate: TranslateService,
  ) {
    this.dataSource = new MatTableDataSource<Event>([]);
  }

  public get locale(): Language {
    return this.translate.currentLang as Language;
  }

  public ngOnChanges(changes: SimpleChanges) {
    const events = changes['events'];
    if (events) {
      this.dataSource.data = events.currentValue;
    }
  }
}
