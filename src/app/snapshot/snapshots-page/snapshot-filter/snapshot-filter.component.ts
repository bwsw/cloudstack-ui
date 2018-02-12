import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Account } from '../../../shared/models/account.model';
import { DateTimeFormatterService } from '../../../shared/services/date-time-formatter.service';
import { Language } from '../../../shared/services/language.service';

@Component({
  selector: 'cs-snapshots-filter',
  templateUrl: './snapshot-filter.component.html'
})
export class SnapshotFilterComponent {
  @Input() public isLoading: boolean;
  @Input() public accounts: Array<Account> = [];
  @Input() public types: Array<any> = [];
  @Input() public availableGroupings: Array<any> = [];
  @Input() public firstDayOfWeek: number;

  @Input() public selectedAccounts: string[];
  @Input() public selectedTypes: string[];
  @Input() public selectedDate: Date;
  @Input() public selectedGroupings: any[];
  @Input() public query: string;

  @Output() public selectedAccountsChange = new EventEmitter();
  @Output() public selectedTypesChange = new EventEmitter();
  @Output() public selectedDateChange = new EventEmitter();
  @Output() public selectedGroupingsChange = new EventEmitter();
  @Output() public queryChange = new EventEmitter();

  public get locale(): Language {
    return this.translate.currentLang as Language;
  }

  constructor(
    private translate: TranslateService,
    public dateTimeFormatterService: DateTimeFormatterService
  ) {
  }
}
