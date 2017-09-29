import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../shared/services/account.service';
import { ListService } from '../../shared/components/list/list.service';
import { Account, Domain, Role } from '../../shared';
import { RoleService } from '../../shared/services/role.service';
import { DomainService } from '../../shared/services/domain.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'cs-account-page',
  templateUrl: 'account-page.component.html',
  providers: [ListService]
})
export class AccountPageComponent implements OnInit {
  public accounts: Array<Account> = [];
  public domains: Array<Domain>;
  public roles: Array<Role>;
  public groupings = [];

  constructor(
    private accountService: AccountService,
    private roleService: RoleService,
    private domainService: DomainService,
    public listService: ListService,
  ) {}

  public ngOnInit() {
    this.getAccounts();
  }

  public getAccounts() {
    Observable.forkJoin(
      this.accountService.getList(),
      this.domainService.getList(),
      this.roleService.getList()
    ).subscribe(([accounts, domains, roles]) => {
      this.accounts = accounts.map(account => {
        account.role = roles.find(role => role.id === account.roleid).name;
        return account;
      });
      this.domains = domains;
      this.roles = roles;
    });
  }

}
