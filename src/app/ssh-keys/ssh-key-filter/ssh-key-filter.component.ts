import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

export interface SshKeyFilter {
  groupings: Array<any>;
  accounts: Array<Account>;
}

@Component({
  selector: 'cs-ssh-key-filter',
  templateUrl: 'ssh-key-filter.component.html'
})
export class ShhKeyFilterComponent implements OnInit {
  @Input() public accounts: Array<string>;
  @Input() public groupings: Array<any>;
  @Input() public selectedAccounts: Account[] = [];
  @Input() public selectedGroupings: Array<any> = [];
  @Output() public updateFilter = new EventEmitter<SshKeyFilter>();

  public selectedGroupingNames;

  public get selectedAccountIds() {
    return this.selectedAccounts.map(_ => _.id ? _.id : _);
  }

  constructor(private authService: AuthService) {
  }

  public ngOnInit() {
    this.initFilters();
  }

  public initFilters(): void {
    this.selectedGroupingNames = this.selectedGroupings.reduce((acc, _) => {
      const grouping = this.groupings.find(g => g.key === _);
      if (grouping) {
        acc.push(grouping);
      }
      return acc;
    }, []);

    this.update();
  }

  public updateAccount(accounts) {
    this.selectedAccounts = accounts;
    this.update();
  }

  public showAccountFilter(): boolean {
    return this.authService.isAdmin();
  }

  public update() {
    this.updateFilter.emit({
      groupings: this.selectedGroupings,
      accounts: this.selectedAccounts
    });
  }

}
