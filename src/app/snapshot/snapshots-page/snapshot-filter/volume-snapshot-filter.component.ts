import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Account } from '../../../shared/models';
import { DateTimeFormatterService } from '../../../shared/services/date-time-formatter.service';
import { Language } from '../../../shared/types';
import { reorderAvailableGroupings } from '../../../shared/utils/reorder-groupings';
import { VirtualMachine } from '../../../vm';
import { SnapshotPageViewMode } from '../../types';

@Component({
  selector: 'cs-volume-snapshots-filter',
  templateUrl: './volume-snapshot-filter.component.html',
})
export class VolumeSnapshotFilterComponent implements OnInit, OnChanges {
  @Input()
  public viewMode: SnapshotPageViewMode;
  @Input()
  public isLoading: boolean;
  @Input()
  public accounts: Account[] = [];
  @Input()
  public vms: VirtualMachine[] = [];
  @Input()
  public types: any[] = [];
  @Input()
  public availableGroupings: any[] = [];
  @Input()
  public firstDayOfWeek: number;

  @Input()
  public selectedAccounts: string[];
  @Input()
  public selectedVms: string[];
  @Input()
  public selectedTypes: string[];
  @Input()
  public selectedDate: Date;
  @Input()
  public selectedGroupings: any[];
  @Input()
  public query: string;

  @Output()
  public selectedAccountsChange = new EventEmitter();
  @Output()
  public selectedTypesChange = new EventEmitter();
  @Output()
  public selectedDateChange = new EventEmitter();
  @Output()
  public selectedGroupingsChange = new EventEmitter();
  @Output()
  public queryChange = new EventEmitter();
  @Output()
  public selectedVolumeVmsChange = new EventEmitter<string[]>();
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

  public ngOnInit() {
    this.availableGroupings = reorderAvailableGroupings(
      this.availableGroupings,
      this.selectedGroupings,
    );
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
