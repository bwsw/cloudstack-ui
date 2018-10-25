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
  styleUrls: ['vm-logs-filter.component.scss'],
})
export class VmLogsFilterComponent {
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
  public keywords: Keyword[];
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
  @Output()
  public accountsChanged = new EventEmitter<string[]>();
  @Output()
  public vmChanged = new EventEmitter<string>();
  @Output()
  public logFileChanged = new EventEmitter<VmLogFile>();
  @Output()
  public refreshed = new EventEmitter<void>();
  @Output()
  public keywordAdded = new EventEmitter<Keyword>();
  @Output()
  public keywordRemoved = new EventEmitter<Keyword>();
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

  constructor(
    public dateTimeFormatterService: DateTimeFormatterService,
    public translate: TranslateService,
  ) {}

  public get locale(): Language {
    return this.translate.currentLang as Language;
  }
}
