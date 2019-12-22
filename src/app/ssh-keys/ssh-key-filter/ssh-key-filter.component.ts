import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Account, Grouping } from '../../shared/models';
import { reorderAvailableGroupings } from '../../shared/utils/reorder-groupings';

@Component({
  selector: 'cs-ssh-key-filter',
  templateUrl: 'ssh-key-filter.component.html',
})
export class ShhKeyFilterComponent implements OnInit, OnChanges {
  @Input()
  public accounts: Account[];
  @Input()
  public selectedAccountIds: string[] = [];
  @Input()
  public selectedGroupings: Grouping[] = [];
  @Input()
  public groupings: Grouping[];
  @Output()
  public groupingsChanged = new EventEmitter<Grouping[]>();
  @Output()
  public accountsChanged = new EventEmitter<string[]>();

  public accountsFiltered: Account[] = [];
  public accountQuery = '';

  public ngOnInit() {
    this.groupings = reorderAvailableGroupings(this.groupings, this.selectedGroupings);
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
