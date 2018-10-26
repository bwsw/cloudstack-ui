import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { BackendResource } from '../decorators';
import { AsyncJobService } from './async-job.service';
import { BaseBackendService, CSCommands } from './base-backend.service';
import { Account } from '../models';

@Injectable()
@BackendResource({
  entity: 'Account',
})
export class AccountService extends BaseBackendService<Account> {
  constructor(protected http: HttpClient, private asyncJobService: AsyncJobService) {
    super(http);
  }

  public getAccount(params: {}): Observable<Account> {
    return this.getList(params).pipe(map(accounts => accounts[0]));
  }

  public removeAccount(account: Account): Observable<Account> {
    return this.sendCommand(CSCommands.Delete, { id: account.id }).pipe(
      switchMap(job => this.asyncJobService.queryJob(job, this.entity)),
      switchMap(() => of(account)),
    );
  }

  public disableAccount(account: Account): Observable<Account> {
    return this.sendCommand(CSCommands.Disable, {
      id: account.id,
      lock: false,
    }).pipe(switchMap(job => this.asyncJobService.queryJob(job, this.entity)));
  }

  public enableAccount(account: Account): Observable<Account> {
    return this.sendCommand(CSCommands.Enable, {
      id: account.id,
    }).pipe(map(res => res.account));
  }
}
