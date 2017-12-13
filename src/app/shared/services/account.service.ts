import { Injectable } from '@angular/core';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { Account } from '../models/account.model';
import { BaseBackendService } from './base-backend.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
@BackendResource({
  entity: 'Account',
  entityModel: Account
})
export class AccountService extends BaseBackendService<Account> {

  constructor(protected http: HttpClient) {
    super(http);
  }

  public getAccount(params: {}): Observable<Account> {
    return this.getList(params).map(accounts => accounts[0]);
  }

  public removeAccount(account: Account): Observable<{ jobid: string }> {
    return this.sendCommand('delete', {
      id: account.id,
    });
  }

  public disableAccount(account: Account): Observable<{ jobid: string }> {
    return this.sendCommand('disable', {
      id: account.id,
      lock: false
    });
  }

  public lockAccount(account: Account): Observable<{ jobid: string }> {
    return this.sendCommand('disable', {
      id: account.id,
      lock: true
    });
  }

  public enableAccount(account: Account): Observable<{ account: Account }> {
    return this.sendCommand('enable', {
      id: account.id
    });
  }
}
