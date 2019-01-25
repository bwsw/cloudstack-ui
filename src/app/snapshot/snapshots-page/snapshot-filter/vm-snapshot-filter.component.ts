import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Account } from '../../../shared/models';
import { DateTimeFormatterService } from '../../../shared/services/date-time-formatter.service';
import { Language } from '../../../shared/types';
import { VirtualMachine } from '../../../vm';
import { SnapshotPageViewMode } from '../../types';

@Component({
  selector: 'cs-vm-snapshots-filter',
  templateUrl: './vm-snapshot-filter.component.html',
})
export class VmSnapshotFilterComponent {
  @Input()
  public isLoading: boolean;
  @Input()
  public viewMode: SnapshotPageViewMode;
  @Input()
  public accounts: Account[] = [];
  @Input()
  public vms: VirtualMachine[] = [];
  @Input()
  public firstDayOfWeek: number;

  @Input()
  public selectedAccounts: string[];
  @Input()
  public selectedVms: string[];
  @Input()
  public selectedDate: Date;

  @Output()
  public selectedAccountsChange = new EventEmitter();
  @Output()
  public selectedVmsChange = new EventEmitter<string[]>();
  @Output()
  public selectedDateChange = new EventEmitter();
  @Output()
  public viewModeChange = new EventEmitter<SnapshotPageViewMode>();

  public get locale(): Language {
    return this.translate.currentLang as Language;
  }

  constructor(
    private translate: TranslateService,
    public dateTimeFormatterService: DateTimeFormatterService,
  ) {}
}
