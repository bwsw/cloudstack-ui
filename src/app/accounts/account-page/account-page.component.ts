import { Component, EventEmitter, Input, Output } from '@angular/core';
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
export class AccountPageComponent {
  @Input() public accounts: Array<Account> = [];
  @Input() public domains: Array<Domain>;
  @Input() public roles: Array<Role>;
  @Input() public roleTypes: Array<string>;
  @Input() public states: Array<string>;
  @Input() public isLoading: boolean;
  @Input() public selectedRoleTypes: string[] = [];
  @Input() public selectedDomainIds: string[] = [];
  @Input() public selectedRoleNames: string[] = [];
  @Input() public selectedStates: string[] = [];

  @Output() public onDomainsChange = new EventEmitter();
  @Output() public onRolesChange = new EventEmitter();
  @Output() public onRoleTypesChange = new EventEmitter();
  @Output() public onStatesChange = new EventEmitter();

  public groupings = [];

  constructor(
    private accountService: AccountService,
    private roleService: RoleService,
    private domainService: DomainService,
    public listService: ListService,
  ) {}


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
      const allTypes = roles.map(role => role.type);
      this.roleTypes = allTypes.filter((value, index) => allTypes.indexOf(value) == index );
    });
  }

}
