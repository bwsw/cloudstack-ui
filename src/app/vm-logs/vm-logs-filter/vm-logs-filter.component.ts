import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { VirtualMachine } from '../../vm';
import { DateTimeFormatterService } from '../../shared/services/date-time-formatter.service';
import { TranslateService } from '@ngx-translate/core';
import { Language, TimeFormat } from '../../shared/types';
import { Time } from '../../shared/components/time-picker/time-picker.component';
import { VmLogFile } from '../models/vm-log-file.model';
import { Account } from '../../shared/models';

@Component({
  selector: 'cs-vm-logs-filter',
  templateUrl: 'vm-logs-filter.component.html',
  styleUrls: ['vm-logs-filter.component.scss'],
})
export class VmLogsFilterComponent implements OnChanges {
  @Input()
  public accounts: Account[];
  @Input()
  public vms: VirtualMachine[];
  @Input()
  public logFiles: VmLogFile[];
  @Input()
  public selectedAccountIds: string[];
  @Input()
  public selectedVmId: string;
  @Input()
  public selectedLogFile: string;
  @Input()
  public search: string;
  @Input()
  public firstDayOfWeek: number;
  @Input()
  public startDate: Date;
  @Input()
  public startTime: Time;
  @Input()
  public endDate: Date;
  @Input()
  public endTime: Time;
  @Input()
  public newestFirst: boolean;
  @Input()
  public isAutoUpdateEnabled: boolean;
  @Input()
  public timeFormat: TimeFormat;
  @Output()
  public accountsChanged = new EventEmitter<string[]>();
  @Output()
  public vmChanged = new EventEmitter<string>();
  @Output()
  public logFileChanged = new EventEmitter<VmLogFile>();
  @Output()
  public refreshed = new EventEmitter<void>();
  @Output()
  public searchChanged = new EventEmitter<string>();
  @Output()
  public startDateChanged = new EventEmitter<Date>();
  @Output()
  public startTimeChanged = new EventEmitter<Time>();
  @Output()
  public endDateChanged = new EventEmitter<Date>();
  @Output()
  public endTimeChanged = new EventEmitter<Time>();
  @Output()
  public newestFirstChanged = new EventEmitter<void>();

  public accountsFiltered: Account[] = [];
  public accountQuery = '';

  constructor(
    public dateTimeFormatterService: DateTimeFormatterService,
    public translate: TranslateService,
  ) {}

  public get locale(): Language {
    return this.translate.currentLang as Language;
  }

  public ngOnChanges(changes: SimpleChanges) {
    const accounts = changes['accounts'];
    if (accounts) {
      this.onAccountQueryChanged(this.accountQuery);
    }
  }

  public onAccountQueryChanged(accountQuery: string) {
    const queryLower = accountQuery && accountQuery.toLowerCase();
    this.accountsFiltered = this.accounts.filter(
      account => !accountQuery || account.name.toLowerCase().includes(queryLower),
    );
  }
}
