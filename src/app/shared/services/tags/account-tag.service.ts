import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { accountResourceType } from '../../models/account.model';
import { SSHKeyPair } from '../../models/ssh-keypair.model';
import { User } from '../../models/user.model';
import { AccountService } from '../account.service';
import { AuthService } from '../auth.service';
import { accountTagKeys } from './account-tag-keys';
import { EntityTagService } from './entity-tag-service.interface';
import { TagService } from './tag.service';

@Injectable()
export class AccountTagService implements EntityTagService {
  public keys = accountTagKeys;

  constructor(
    protected accountService: AccountService,
    protected authService: AuthService,
    protected tagService: TagService,
  ) {}

  public get user(): User {
    return this.authService.user;
  }

  public getSshKeyDescription(sshKey: SSHKeyPair): Observable<string> {
    return this.accountService
      .getAccount({ name: this.user.account, domainid: this.user.domainid })
      .pipe(
        switchMap(account => {
          return this.tagService.getTag(account, this.getSshKeyDescriptionKey(sshKey)).pipe(
            map(tag => {
              if (tag) {
                return this.tagService.getValueFromTag(tag);
              }
            }),
          );
        }),
      );
  }

  public setSshKeyDescription(sshKey: SSHKeyPair, description: string): Observable<string> {
    return this.writeTag(this.getSshKeyDescriptionKey(sshKey), description).pipe(
      map(() => description),
    );
  }

  public writeTag(key: string, value: string): Observable<any> {
    return this.accountService
      .getAccount({ name: this.user.account, domainid: this.user.domainid })
      .pipe(
        switchMap(account => {
          return this.tagService.update(account, accountResourceType, key, value);
        }),
      );
  }

  private getSshKeyDescriptionKey(sshKey: SSHKeyPair): string {
    return `${this.keys.sshDescription}.${sshKey.fingerprint}`;
  }
}
