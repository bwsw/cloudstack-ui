import { Component } from '@angular/core';
import { Account } from '../../../shared/models/account.model';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../../shared/services/account.service';

@Component({
  selector: 'cs-account-detail',
  templateUrl: 'account-details.component.html'
})
export class AccountDetailsComponent {
  public account: Account;

  constructor(
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute
  ) {
    const params = this.activatedRoute.snapshot.parent.params;

    this.accountService.get(params.id).subscribe(
      account => {
        this.account = account;
      });
  }



}
