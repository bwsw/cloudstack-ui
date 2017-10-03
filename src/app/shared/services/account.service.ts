import { Injectable } from '@angular/core';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { Account } from '../models/account.model';
import { BaseBackendService } from './base-backend.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AsyncJobService } from './async-job.service';

@Injectable()
@BackendResource({
  entity: 'Account',
  entityModel: Account
})
export class AccountService extends BaseBackendService<Account> {
  constructor(protected http: HttpClient, private asyncJob: AsyncJobService) {
    super(http);
  }

  public updateAccount(
    account: Account
  ): Observable<Account> {
    return this.sendCommand('update', {
      accountid: account.id
    });
  }
}
