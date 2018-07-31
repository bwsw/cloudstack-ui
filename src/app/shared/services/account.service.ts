import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BackendResource } from '../decorators';
import { AsyncJobService } from './async-job.service';
import { BaseBackendService, CSCommands } from './base-backend.service';
import { Account, AsyncJob } from '../models';

@Injectable()
@BackendResource({
  entity: 'Account'
})
export class AccountService extends BaseBackendService<Account> {

  constructor(
    protected http: HttpClient,
    private asyncJobService: AsyncJobService
  ) {
    super(http);
  }

  public getAccount(params: {}): Observable<Account> {
    return this.getList(params).map(accounts => accounts[0]);
  }

  public removeAccount(account: Account): Observable<Account> {
    return this.sendCommand(CSCommands.Delete, { id: account.id })
      .switchMap(job => this.asyncJobService.queryJob(job))
      .switchMap(response => Observable.of(account));
  }

  public disableAccount(account: Account): Observable<Account> {
    return this.sendCommand(CSCommands.Disable, {
      id: account.id,
      lock: false
    }).switchMap(job => this.asyncJobService.queryJob(job))
      .switchMap((response: AsyncJob<any>) => Observable.of(response.jobresult.account));
  }

  public enableAccount(account: Account): Observable<Account> {
    return this.sendCommand(CSCommands.Enable, {
      id: account.id
    }).map(res => res.account);
  }
}
