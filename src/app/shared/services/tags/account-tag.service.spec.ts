import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, } from '@angular/core/testing';
import { of } from 'rxjs/observable/of';
import { AccountTagService } from './account-tag.service';
import { Injectable } from '@angular/core';
import { AccountService } from '../account.service';
import { User } from '../../models/user.model';
import { AuthService } from '../auth.service';
import { TagService } from './tag.service';
import { Tag } from '../../models/tag.model';
import { SSHKeyPair } from '../../models/ssh-keypair.model';
import { AccountResourceType } from '../../models/account.model';
import { StorageTypes } from '../../models/offering.model';
import { ServiceOffering } from '../../models/service-offering.model';

@Injectable()
class MockService {
  public getAccount(params: {}) {
    return {
      switchMap: (f) => {
        return f(<Account>{ account: 'Account', domainid: 'D1'});
    }
    };
  }
}

@Injectable()
export class MockAuthService {
  public get user() {
    return <User>{
      account: 'Account',
      domainid: 'D1'
    };
  }
}

@Injectable()
class MockTagService {
  public getTag(): void {
  }
  public getValueFromTag(): void {
  }
  public update(): void {
  }
}

describe('Account tag service', () => {
  let accountTagService: AccountTagService;
  let accountService: AccountService;
  let tagService: TagService;


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AccountTagService,
        { provide: AccountService, useClass: MockService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: TagService, useClass: MockTagService }
      ],
      imports: [
        HttpClientTestingModule
      ]
    });

    accountTagService = TestBed.get(AccountTagService);
    accountService = TestBed.get(AccountService);
    tagService = TestBed.get(TagService);
  });

  it('should return user', () => {
    expect(accountTagService.user).toEqual(<User>{ account: 'Account', domainid: 'D1' });
  });

  it('should return ssh-key description', () => {
    spyOn(tagService, 'getTag').and.returnValue(of(<Tag>{ key: 'ssh-key-description', value: 'desc' }));
    spyOn(tagService, 'getValueFromTag').and.returnValue('desc');
    accountTagService.getSshKeyDescription(<SSHKeyPair>{}).subscribe(res =>
      expect(res).toEqual('desc'));
  });

  it('should not return ssh-key description', () => {
    spyOn(tagService, 'getTag').and.returnValue(of(null));
    spyOn(tagService, 'getValueFromTag').and.returnValue('desc');
    accountTagService.getSshKeyDescription(<SSHKeyPair>{}).subscribe(res =>
      expect(res).not.toBeDefined());
  });

  it('should set ssh-key description', () => {
    spyOn(accountTagService, 'writeTag').and.returnValue(of(true));
    const key = <SSHKeyPair>{fingerprint: '123'};

    accountTagService.setSshKeyDescription(key, 'desc').subscribe(res =>
      expect(res).toEqual('desc'));
  });

  it('should write tag', () => {
    const spyUpdate = spyOn(tagService, 'update').and.returnValue(of(true));
    const key = <SSHKeyPair>{fingerprint: '123'};

    accountTagService.writeTag('key', 'value').subscribe(res =>
      expect(res).toBeTruthy());
    expect(spyUpdate).toHaveBeenCalledWith(
      <Account>{ account: 'Account', domainid: 'D1'}, AccountResourceType, 'key', 'value');
  });

  it('should set service offering params', () => {
    const spyWrite = spyOn(accountTagService, 'writeTag').and.returnValue(of(true));
    const offering = <ServiceOffering>{
      id: '1', name: 'off1', hosttags: 't1,t2',
      storagetype: StorageTypes.local, cpuspeed: 1,
      cpunumber: 2, memory: 2, iscustomized: true
    };

    accountTagService.setServiceOfferingParams(offering).subscribe(res =>
      expect(res).toEqual(offering));
    expect(spyWrite).toHaveBeenCalledWith('csui.service-offering.param.1.cpuNumber', '2');
    expect(spyWrite).toHaveBeenCalledWith('csui.service-offering.param.1.cpuSpeed', '1');
    expect(spyWrite).toHaveBeenCalledWith('csui.service-offering.param.1.memory', '2');
  });

});
