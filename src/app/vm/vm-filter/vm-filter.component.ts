import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Account, Grouping, Zone } from '../../shared/models';
import { reorderAvailableGroupings } from '../../shared/utils/reorder-groupings';

export type noGroup = '';
export const noGroup: noGroup = '';

@Component({
  selector: 'cs-vm-filter',
  templateUrl: 'vm-filter.component.html',
  styleUrls: ['vm-filter.component.scss'],
})
export class VmFilterComponent implements OnInit, OnChanges {
  @Input()
  public selectedGroupings: Grouping[];
  @Input()
  public groupings: Grouping[];
  @Input()
  public groups: string[];
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
  public accountsFiltered: Account[] = [];
  public accountQuery = '';

  public ngOnChanges(changes: SimpleChanges) {
    const accounts = changes['accounts'];
    if (accounts) {
      this.onAccountQueryChanged(this.accountQuery);
    }
  }

  public ngOnInit() {
    this.groupings = reorderAvailableGroupings(this.groupings, this.selectedGroupings);
  }

  public onAccountQueryChanged(accountQuery: string) {
    const queryLower = accountQuery && accountQuery.toLowerCase();
    this.accountsFiltered = this.accounts.filter(
      account => !accountQuery || account.name.toLowerCase().includes(queryLower),
    );
  }
}
