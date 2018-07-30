import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Account, Grouping, Zone } from '../../shared/models';
import { reorderAvailableGroupings } from '../../shared/utils/reorder-groupings';

export type noGroup = '-1';
export const noGroup: noGroup = '-1';

@Component({
  selector: 'cs-vm-filter',
  templateUrl: 'vm-filter.component.html'
})
export class VmFilterComponent implements OnInit {
  @Input() public selectedGroupings: Array<Grouping>;
  @Input() public groupings: Array<Grouping>;
  @Input() public groups: Array<any>;
  @Input() public states: Array<any>;
  @Input() public zones: Array<Zone>;
  @Input() public query: string;
  @Input() public accounts: Array<Account>;
  @Input() public selectedZoneIds: Array<string>;
  @Input() public selectedGroupNames: Array<string>;
  @Input() public selectedAccountIds: Array<string>;
  @Input() public selectedStates: Array<any>;
  @Output() public onQueryChange = new EventEmitter();
  @Output() public onGroupingsChange = new EventEmitter();
  @Output() public onZonesChange = new EventEmitter();
  @Output() public onGroupNamesChange = new EventEmitter();
  @Output() public onAccountsChange = new EventEmitter();
  @Output() public onStatesChange = new EventEmitter();

  public noGroup = noGroup;

  public ngOnInit() {
    this.groupings = reorderAvailableGroupings(this.groupings, this.selectedGroupings);
  }
}
