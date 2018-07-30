import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Grouping } from '../../shared/models';
import { reorderAvailableGroupings } from '../../shared/utils/reorder-groupings';

@Component({
  selector: 'cs-ssh-key-filter',
  templateUrl: 'ssh-key-filter.component.html'
})
export class ShhKeyFilterComponent implements OnInit {
  @Input() public accounts: Array<Account>;
  @Input() public selectedAccountIds: Array<string> = [];
  @Input() public selectedGroupings: Array<Grouping> = [];
  @Input() public groupings: Array<Grouping>;
  @Output() public onGroupingsChange = new EventEmitter<Array<Grouping>>();
  @Output() public onAccountsChange = new EventEmitter<Array<string>>();

  public ngOnInit() {
    this.groupings = reorderAvailableGroupings(this.groupings, this.selectedGroupings);
  }
}
