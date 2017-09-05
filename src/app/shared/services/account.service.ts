import { Injectable } from '@angular/core';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { Account } from '../models/account.model';
import { BaseBackendService } from './base-backend.service';

@Injectable()
@BackendResource({
  entity: 'Account',
  entityModel: Account
})
export class AccountService extends BaseBackendService<Account> {

}
