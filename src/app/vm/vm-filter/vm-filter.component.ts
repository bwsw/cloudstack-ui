import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Account, Grouping, Zone } from '../../shared/models';
import { reorderAvailableGroupings } from '../../shared/utils/reorder-groupings';

export type noGroup = '-1';
export const noGroup: noGroup = '-1';

@Component({
  selector: 'cs-vm-filter',
  templateUrl: 'vm-filter.component.html',
})
export class VmFilterComponent implements OnInit {
  @Input()
  public selectedGroupings: Grouping[];
  @Input()
  public groupings: Grouping[];
  @Input()
  public groups: any[];
  @Input()
  public states: any[];
  @Input()
  public zones: Zone[];
  @Input()
  public query: string;
  @Input()
  public accounts: Account[];
  @Input()
  public selectedZoneIds: string[];
  @Input()
  public selectedGroupNames: string[];
  @Input()
  public selectedAccountIds: string[];
  @Input()
  public selectedStates: any[];
  @Output()
  public queryChanged = new EventEmitter();
  @Output()
  public groupingsChanged = new EventEmitter();
  @Output()
  public zonesChanged = new EventEmitter();
  @Output()
  public groupNamesChanged = new EventEmitter();
  @Output()
  public accountsChanged = new EventEmitter();
  @Output()
  public statesChanged = new EventEmitter();

  public noGroup = noGroup;

  public ngOnInit() {
    this.groupings = reorderAvailableGroupings(this.groupings, this.selectedGroupings);
  }
}
