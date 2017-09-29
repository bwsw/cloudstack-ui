import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterComponent } from '../../shared/interfaces/filter-component';
import { FilterService } from '../../shared/services/filter.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { Account } from '../../shared/models/account.model';
import { AuthService } from '../../shared/services/auth.service';

export interface SshKeyFilter {
  groupings: Array<any>;
  accounts: Array<Account>;
}

export const sshKeyListFilters = 'sshKeyListFilters';


@Component({
  selector: 'cs-ssh-key-filter',
  templateUrl: 'ssh-key-filter.component.html'
})
export class ShhKeyFilterComponent implements FilterComponent<SshKeyFilter>, OnInit {
  @Input() public groupings: Array<any>;
  @Output() public updateFilters: EventEmitter<SshKeyFilter>;


  public selectedGroupingNames = [];
  public selectedAccounts: Array<Account> = [];
  public selectedAccountIds: Array<string> = [];

  private filtersKey = sshKeyListFilters;
  private filterService = new FilterService({
    groupings: { type: 'array', defaultOption: [] },
    accounts: {type: 'array', defaultOption: [] }
  }, this.router, this.localStorage, this.filtersKey, this.activatedRoute);

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private localStorage: LocalStorageService,
    private authService: AuthService
  ) {
    this.updateFilters = new EventEmitter();
  }

  public ngOnInit() {
    this.initFilters();
  }


  public showAccountFilter(): boolean {
    return this.authService.isAdmin();
  }

  public initFilters(): void {
    const params = this.filterService.getParams();
    this.selectedAccountIds = params['accounts'];

    this.selectedGroupingNames = params.groupings.reduce((acc, _) => {
      const grouping = this.groupings.find(g => g.key === _);
      if (grouping) {
        acc.push(grouping);
      }
      return acc;
    }, []);

    this.update();
  }

  public updateAccount(accounts: Array<Account>) {
    this.selectedAccounts = accounts;
    this.update();
  }

  public update(): void {
    this.updateFilters.emit({
      groupings: this.selectedGroupingNames,
      accounts: this.selectedAccounts
    });

    this.filterService.update(this.filtersKey, {
      groupings: this.selectedGroupingNames.map(_ => _.key),
      accounts: this.selectedAccounts.map(_ => _.id)
    });
  }
}
