import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
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
export class VmSnapshotFilterComponent implements OnChanges {
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

  public accountsFiltered: Account[] = [];
  public accountQuery = '';

  public get locale(): Language {
    return this.translate.currentLang as Language;
  }

  constructor(
    private translate: TranslateService,
    public dateTimeFormatterService: DateTimeFormatterService,
  ) {}

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
