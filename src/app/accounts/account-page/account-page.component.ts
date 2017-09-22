import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../shared/services/account.service';
import { ListService } from '../../shared/components/list/list.service';

@Component({
  selector: 'cs-account-page',
  templateUrl: 'account-page.component.html',
  providers: [ListService]
})
export class AccountPageComponent implements OnInit {
  public accounts: Array<Account>;
  public groupings = [
    {
      key: 'accounts',
      label: 'VOLUME_PAGE.FILTERS.GROUP_BY_ACCOUNT',
      selector: (item: Account) => item,
      name: (item: Account) => item
    }
  ];

  constructor(
    private accountService: AccountService,
    public listService: ListService,
  ) {}

  public ngOnInit() {
    this.getAccounts();
  }

  public getAccounts() {
    this.accountService.getList().subscribe((accounts) => {
      this.accounts = accounts;
    });
  }

}
