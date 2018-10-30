import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Account } from '../../../shared/models';
import { Language } from '../../../shared/types';
import { DateTimeFormatterService } from '../../../shared/services/date-time-formatter.service';
import { reorderAvailableGroupings } from '../../../shared/utils/reorder-groupings';
import { SidebarContainerService } from '../../../shared/services/sidebar-container.service';

@Component({
  selector: 'cs-snapshots-filter',
  templateUrl: './snapshot-filter.component.html',
})
export class SnapshotFilterComponent implements OnInit {
  @Input()
  public isLoading: boolean;
  @Input()
  public accounts: Account[] = [];
  @Input()
  public types: any[] = [];
  @Input()
  public availableGroupings: any[] = [];
  @Input()
  public firstDayOfWeek: number;

  @Input()
  public selectedAccounts: string[];
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

  public get locale(): Language {
    return this.translate.currentLang as Language;
  }

  public get marginRight() {
    return this.sidebarContainerService.isOpen.getValue()
      ? this.sidebarContainerService.width.getValue()
      : 0;
  }

  constructor(
    private translate: TranslateService,
    public dateTimeFormatterService: DateTimeFormatterService,
    private sidebarContainerService: SidebarContainerService,
  ) {}

  public ngOnInit() {
    this.availableGroupings = reorderAvailableGroupings(
      this.availableGroupings,
      this.selectedGroupings,
    );
  }
}
