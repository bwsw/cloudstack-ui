import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Account } from '../../../shared/models';
import { DateTimeFormatterService } from '../../../shared/services/date-time-formatter.service';
import { Language } from '../../../shared/types';
import { reorderAvailableGroupings } from '../../../shared/utils/reorder-groupings';
import { VirtualMachine } from '../../../vm';
import { SnapshotPageViewMode } from '../../types';

@Component({
  selector: 'cs-snapshots-filter',
  templateUrl: './snapshot-filter.component.html',
})
export class SnapshotFilterComponent implements OnInit {
  @Input()
  public isLoading: boolean;
  @Input()
  public viewMode: SnapshotPageViewMode;
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
  public selectedVmsIds: string[];
  @Input()
  public selectedVolumeVmIds: string[];
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
  public selectedVmsChange = new EventEmitter<string[]>();
  @Output()
  public selectedTypesChange = new EventEmitter();
  @Output()
  public selectedDateChange = new EventEmitter();
  @Output()
  public selectedGroupingsChange = new EventEmitter();
  @Output()
  public queryChange = new EventEmitter();
  @Output()
  public viewModeChange = new EventEmitter<SnapshotPageViewMode>();
  @Output()
  public selectedVolumeVmsChange = new EventEmitter<string[]>();

  public get locale(): Language {
    return this.translate.currentLang as Language;
  }

  public snapshotPageViewMode = SnapshotPageViewMode;

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

  public onViewModeChange(mode: SnapshotPageViewMode) {
    this.viewModeChange.emit(mode);
  }
}
