import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VirtualMachine } from '../../vm';
import { Keyword } from '../models/keyword.model';
import { DateTimeFormatterService } from '../../shared/services/date-time-formatter.service';
import { TranslateService } from '@ngx-translate/core';
import { Language } from '../../shared/types';
import { Time } from '../../shared/components/time-picker/time-picker.component';
import { VmLogFile } from '../models/vm-log-file.model';

@Component({
  selector: 'cs-vm-logs-filter',
  templateUrl: 'vm-logs-filter.component.html',
  styleUrls: ['vm-logs-filter.component.scss']
})
export class VmLogsFilterComponent {
  // public dateTimeFormat = Intl.DateTimeFormat;
  // public date = new Date();
  @Input() public accounts: Array<Account>;
  @Input() public vms: Array<VirtualMachine>;
  @Input() public logFiles: Array<VmLogFile>;
  @Input() public selectedAccountIds: Array<string>;
  @Input() public selectedVmId: string;
  @Input() public selectedLogFile: VmLogFile;
  @Input() public keywords: Array<Keyword>;
  @Input() public firstDayOfWeek: number;
  @Input() public startDate: Date;
  @Input() public startTime: Time;
  @Input() public endDate: Date;
  @Input() public endTime: Time;
  @Output() public onAccountsChange = new EventEmitter<Array<string>>();
  @Output() public onVmChange = new EventEmitter<string>();
  @Output() public onLogFileChange = new EventEmitter<VmLogFile>();
  @Output() public onRefresh = new EventEmitter<void>();
  @Output() public onKeywordAdd = new EventEmitter<Keyword>();
  @Output() public onKeywordRemove = new EventEmitter<Keyword>();
  @Output() public onStartDateChange = new EventEmitter<Date>();
  @Output() public onStartTimeChange = new EventEmitter<Time>();
  @Output() public onEndDateChange = new EventEmitter<Date>();
  @Output() public onEndTimeChange = new EventEmitter<Time>();
  // @Output() public onNewestFirstChange = new EventEmitter();

  constructor(
    public dateTimeFormatterService: DateTimeFormatterService,
    public translate: TranslateService
  ) {
  }

  public get locale(): Language {
    return this.translate.currentLang as Language;
  }
}
