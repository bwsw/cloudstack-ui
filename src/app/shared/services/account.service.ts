import { Injectable } from '@angular/core';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { Account } from '../models/account.model';
import { BaseBackendService } from './base-backend.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
@BackendResource({
  entity: 'Account',
  entityModel: Account
})
export class AccountService extends BaseBackendService<Account> {
  constructor(protected http: HttpClient) {
    super(http);
  }
}
