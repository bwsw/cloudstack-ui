import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { Event } from '../event.model';
import { DateTimeFormatterService } from '../../shared/services/date-time-formatter.service';
import { TranslateService } from '@ngx-translate/core';
import { Language } from '../../shared/services/language.service';
import { Account } from '../../shared/models/account.model';

@Component({
  selector: 'cs-event-list',
  templateUrl: 'event-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['event-list.component.scss']
})
export class EventListComponent {

  public levels = ['INFO', 'WARN', 'ERROR'];
  @Input() public events: Event[] = [];
  @Input() public selectedTypes: string[] = [];
  @Input() public selectedLevels: string[] = [];
  @Input() public eventTypes: string[] = [];
  @Input() public firstDayOfWeek: number;
  @Input() public isLoading = false;
  @Input() public date: Date;
  @Input() public query: string;
  @Input() public accounts: Account[] = [];
  @Input() public selectedAccountIds: string[] = [];
  @Input() public isAdmin: boolean;
  @Output() public onDateChange = new EventEmitter<Date>();
  @Output() public onQueryChange = new EventEmitter<string>();
  @Output() public onEventTypesChange = new EventEmitter<Array<string>>();
  @Output() public onSelectedLevelsChange = new EventEmitter<Array<string>>();
  @Output() public onAccountChange = new EventEmitter<Array<string>>();

  public tableColumns = ['description', 'level', 'type', 'time'];

  constructor(
    public dateTimeFormatterService: DateTimeFormatterService,
    public translate: TranslateService
  ) {
  }

  public get locale(): Language {
    return this.translate.currentLang as Language;
  }
}
