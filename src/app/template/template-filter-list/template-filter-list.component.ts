import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OsType } from '../../shared/models/os-type.model';
import { Zone } from '../../shared/models/zone.model';
import { Account } from '../../shared/models/account.model';

import { Domain } from '../../shared/models/domain.model';
import { templateGroupings } from '../containers/template-page.container';
import { Dictionary } from '@ngrx/entity/src/models';

@Component({
  selector: 'cs-template-filter-list',
  templateUrl: 'template-filter-list.component.html',
  styleUrls: ['template-filter-list.component.scss']
})
export class TemplateFilterListComponent {
  @Input() public showDelimiter = true;
  @Input() public viewMode: string;
  @Input() public accounts: Account[];
  @Input() public domains: Dictionary<Domain>;
  @Input() public osTypes: OsType[];
  @Input() public zoneId: string;
  @Input() public zones: Array<Zone>;
  @Input() public query: string;

  @Input() public selectedAccountIds: string;
  @Input() public selectedGroupings: any[];
  @Input() public selectedTypes: any[];
  @Input() public selectedZones: any[];
  @Input() public selectedOsFamilies: any[];

  @Output() public viewModeChange = new EventEmitter<any>();
  @Output() public onQueryChange = new EventEmitter<any>();
  @Output() public onSelectedAccountsChange = new EventEmitter<any>();
  @Output() public onSelectedGroupingsChange = new EventEmitter<any>();
  @Output() public onSelectedTypesChange = new EventEmitter<any>();
  @Output() public onSelectedOsFamiliesChange = new EventEmitter<any>();
  @Output() public onSelectedZonesChange = new EventEmitter<any>();

  readonly groupings = templateGroupings;
}
