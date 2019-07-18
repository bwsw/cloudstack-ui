import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { SecurityGroupViewMode } from '../sg-view-mode';
import { Account } from '../../shared/models';

export interface SecurityGroupFilter {
  viewMode: SecurityGroupViewMode;
  query: string;
  selectedAccountIds: string[];
  selectOrphanSG: boolean;
}

@Component({
  selector: 'cs-sg-filter',
  templateUrl: 'sg-filter.component.html',
  styleUrls: ['sg-filter.component.scss'],
})
export class SgFilterComponent implements OnChanges {
  @Input()
  public accounts: Account[];
  @Input()
  public orphan: boolean;
  @Output()
  public viewModeChange = new EventEmitter<SecurityGroupViewMode>();
  @Output()
  public queryChange = new EventEmitter<string>();
  @Output()
  public vmChange = new EventEmitter<string>();
  @Output()
  public accountsChanged = new EventEmitter<string[]>();
  @Output()
  public orphanChanged = new EventEmitter<boolean>();

  public viewMode: SecurityGroupViewMode;
  public query: string;
  public selectedAccountIds: string[];
  public accountsFiltered: Account[] = [];
  public accountQuery = '';

  @Input()
  public set filters(filter: SecurityGroupFilter) {
    this.viewMode = filter.viewMode;
    this.query = filter.query;
    this.selectedAccountIds = filter.selectedAccountIds;
    this.orphan = filter.selectOrphanSG;
  }

  public get SecurityGroupViewMode() {
    return SecurityGroupViewMode;
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
