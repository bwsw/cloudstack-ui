import { Component, EventEmitter, Output } from '@angular/core';
import { Account } from '../../models/account.model';
import { AccountService } from '../../services/account.service';
import { DomainService } from "../../services/domain.service";
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'cs-account-filter',
  templateUrl: 'account-filter.component.html'
})
export class AccountFilterComponent {
  @Output() public onChangeAccount = new EventEmitter<Array<Account>>();
  public selected;
  public accounts: Account[];

  constructor (
    private accountService: AccountService,
    private domainService: DomainService
  ) {
    Observable.forkJoin(
      this.accountService.getList(),
      this.domainService.getList()
    ).subscribe(([accounts, domains]) => {
      this.accounts = accounts.map(account => {
        account.fullDomain = domains.find(domain => domain.id === account.domainid).path;
        return account;
      })
    });
  }

  public changeAccount() {
    this.onChangeAccount.emit(this.selected);
  }
}
