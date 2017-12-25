import { EntityTagService } from './entity-tag-service.interface';
import { Observable } from 'rxjs/Observable';
import { SSHKeyPair } from '../../models/ssh-keypair.model';
import { Injectable } from '@angular/core';
import { AccountTagKeys } from './account-tag-keys';
import { AccountService } from '../account.service';
import { AuthService } from '../auth.service';
import { TagService } from './tag.service';
import { User } from '../../models/user.model';

@Injectable()
export class AccountTagService implements EntityTagService {
  public keys = AccountTagKeys;

  constructor(
    protected accountService: AccountService,
    protected authService: AuthService,
    protected tagService: TagService
  ) {
  }

  public get user(): User {
    return this.authService.user;
  }

  public getSshKeyDescription(sshKey: SSHKeyPair): Observable<string> {
    return this.accountService.getAccount({name: this.user.account, domainid: this.user.domainid})
      .switchMap(account => {
          return this.tagService.getTag(account, this.getSshKeyDescriptionKey(sshKey))
            .map(tag => this.tagService.getValueFromTag(tag));
        }
      );
  }

  public setSshKeyDescription(sshKey: SSHKeyPair, description: string): Observable<string> {
    return this.writeTag(this.getSshKeyDescriptionKey(sshKey), description).map(() => description);
  }

  private getSshKeyDescriptionKey(sshKey: SSHKeyPair): string {
    return `${this.keys.sshDescription}.${sshKey.fingerprint}`;
  }

  public writeTag(key: string, value: string): Observable<string> {
    return this.accountService.getAccount({name: this.user.account, domainid: this.user.domainid})
      .switchMap(account => {
        return this.tagService.update(
          account,
          'Account',
          key,
          value)
      });
  }
}
