import { TestBed } from '@angular/core/testing';
import { AccountItemComponent } from './account-item.component';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../shared/models/user.model';
import { Account } from '../../shared/models';

class MockAuthService {
  // tslint:disable-next-line:variable-name
  _user: User;

  get user() {
    return this._user;
  }
}

describe('AccountItemComponent class only', () => {
  let comp: AccountItemComponent;
  let authService: AuthService;
  let authServiceStub: Partial<AuthService>;

  beforeEach(() => {
    authServiceStub = new MockAuthService();

    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authServiceStub }],
    });

    authService = TestBed.get(AuthService);
    comp = new AccountItemComponent(authService);
  });

  it('should determine whether the current user belongs to the account', () => {
    const account1 = 'Jonn Doe';
    const account2 = 'admin';
    const spy = spyOnProperty(authService, 'user', 'get');
    comp.item = { id: '2', name: account1 } as Account;

    spy.and.returnValue({
      account: account1,
    });
    expect(comp.isSelf).toBe(true);

    spy.and.returnValue({
      account: account2,
    });
    expect(comp.isSelf).toBe(false);
  });
});
