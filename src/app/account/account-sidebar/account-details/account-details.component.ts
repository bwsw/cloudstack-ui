import { Component } from '@angular/core';
import { Account } from '../../../shared/models/account.model';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../../shared/services/account.service';
import { ResourceLimit } from '../../../shared/models/resource-limit.model';
import { ResourceLimitService } from '../../../shared/services/resource-limit.service';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'cs-account-detail',
  templateUrl: 'account-details.component.html'
})
export class AccountDetailsComponent {
  public account: Account;
  public limits: Array<ResourceLimit>;

  constructor(
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private resourceLimitService: ResourceLimitService,
    private authService: AuthService
  ) {
    const params = this.activatedRoute.snapshot.parent.params;

    this.accountService.get(params.id)
      .switchMap(account => {
        this.account = account;
        return this.resourceLimitService.getList({
          account: this.account.name,
          domainid: this.account.domainid
        });
      }).subscribe(limits => {
        this.limits = limits;
    });

  }

  public updateLimits(limits: Array<ResourceLimit>) {
    const observes = limits.map(limit => this.resourceLimitService.updateResourceLimit(limit, this.account));
    Observable.forkJoin(...observes).subscribe();
  }

  public isAdmin() {
    return this.authService.isAdmin();
  }

}
