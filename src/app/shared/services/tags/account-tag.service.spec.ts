import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { AccountTagService } from './account-tag.service';
import { Injectable } from '@angular/core';
import { AccountService } from '../account.service';
import { User } from '../../models/user.model';
import { AuthService } from '../auth.service';
import { TagService } from './tag.service';
import { Tag } from '../../models/tag.model';
import { SSHKeyPair } from '../../models/ssh-keypair.model';
import { accountResourceType } from '../../models/account.model';

@Injectable()
class MockService {
  public getAccount(params: {}): Observable<Account> {
    return of({
      account: 'Account',
      displayName: '',
      id: '1',
      rpDisplayName: '',
      domainid: 'D1',
    } as Account);
  }
}

@Injectable()
export class MockAuthService {
  public get user() {
    return {
      account: 'Account',
      domainid: 'D1',
    } as User;
  }
}

@Injectable()
class MockTagService {
  public getTag(): void {}
  public getValueFromTag(): void {}
  public update(): void {}
}

describe('Account tag service', () => {
  let accountTagService: AccountTagService;
  let tagService: TagService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AccountTagService,
        { provide: AccountService, useClass: MockService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: TagService, useClass: MockTagService },
      ],
      imports: [HttpClientTestingModule],
    });

    accountTagService = TestBed.get(AccountTagService);
    tagService = TestBed.get(TagService);
  });

  it('should return user', () => {
    expect(accountTagService.user).toEqual({ account: 'Account', domainid: 'D1' } as User);
  });

  it('should return ssh-key description', () => {
    spyOn(tagService, 'getTag').and.returnValue(
      of({ key: 'ssh-key-description', value: 'desc' } as Tag),
    );
    spyOn(tagService, 'getValueFromTag').and.returnValue('desc');
    accountTagService
      .getSshKeyDescription({} as SSHKeyPair)
      .subscribe(res => expect(res).toEqual('desc'));
  });

  it('should not return ssh-key description', () => {
    spyOn(tagService, 'getTag').and.returnValue(of(null));
    spyOn(tagService, 'getValueFromTag').and.returnValue('desc');
    accountTagService
      .getSshKeyDescription({} as SSHKeyPair)
      .subscribe(res => expect(res).not.toBeDefined());
  });

  it('should set ssh-key description', () => {
    spyOn(accountTagService, 'writeTag').and.returnValue(of(true));
    const key = { fingerprint: '123' } as SSHKeyPair;

    accountTagService
      .setSshKeyDescription(key, 'desc')
      .subscribe(res => expect(res).toEqual('desc'));
  });

  it('should write tag', () => {
    const spyUpdate = spyOn(tagService, 'update').and.returnValue(of(true));
    accountTagService.writeTag('key', 'value').subscribe(res => expect(res).toBeTruthy());

    const account = {
      displayName: '',
      id: '1',
      rpDisplayName: '',
      account: 'Account',
      domainid: 'D1',
    };
    expect(spyUpdate).toHaveBeenCalledWith(account, accountResourceType, 'key', 'value');
  });
});
