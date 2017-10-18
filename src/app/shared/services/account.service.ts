import { Injectable } from '@angular/core';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { Account } from '../models/account.model';
import { BaseBackendService } from './base-backend.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
@BackendResource({
  entity: 'Account',
  entityModel: Account
})
export class AccountService extends BaseBackendService<Account> {
  public onAccountUpdated = new Subject<Account>();

  constructor(protected http: HttpClient) {
    super(http);
  }

  public updateAccount(
    account: Account
  ): Observable<Account> {
    return this.sendCommand('update', {
      accountid: account.id
    });
  }

  public removeAccount(account: Account): Observable<any> {
    return this.sendCommand('delete', {
      id: account.id,
    }).map(() => this.onAccountUpdated.next(account));
  }

  public disableAccount(account: Account): Observable<any> {
    return this.sendCommand('disable', {
      account: account.name,
      lock: false,
      domainid: account.domainid
    }).map(() => this.onAccountUpdated.next(account));
  }

  public lockAccount(account: Account): Observable<any> {
    return this.sendCommand('disable', {
      account: account.name,
      lock: true,
      domainid: account.domainid
    }).map(() => this.onAccountUpdated.next(account));
  }

  public enableAccount(account: Account): Observable<any> {
    return this.sendCommand('enable', {
      account: account.name,
      domainid: account.domainid
    }).map(() => this.onAccountUpdated.next(account));
  }
}
