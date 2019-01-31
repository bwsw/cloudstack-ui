import { Router } from '@angular/router';
import { async, inject, TestBed } from '@angular/core/testing';

import { AccountCreationGuard } from './account-creation-guard.service';
import { AuthService } from '../../shared/services/auth.service';

describe('AccountCreationGuard', () => {
  let service: AccountCreationGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        AccountCreationGuard,
        {
          provide: AuthService,
          useValue: jasmine.createSpyObj(['isAdmin']),
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj(['navigate']),
        },
      ],
    });
    service = TestBed.get(AccountCreationGuard);
    authService = TestBed.get(AuthService);
    router = TestBed.get(Router);
  }));

  it('should be created', inject([AccountCreationGuard], (guard: AccountCreationGuard) => {
    expect(guard).toBeTruthy();
  }));

  describe('canActivate method', () => {
    it('should return true for admin user', () => {
      authService.isAdmin.and.returnValue(true);
      expect(service.canActivate()).toBeTruthy();
    });

    it('should return false for non admin user', () => {
      authService.isAdmin.and.returnValue(false);
      expect(service.canActivate()).toBeFalsy();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
