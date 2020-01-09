import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of, Subject } from 'rxjs';
import { MockSnackBarService } from '../../testutils/mocks/mock-snack-bar.service';
import { MockTranslatePipe } from '../../testutils/mocks/mock-translate.pipe.spec';
import { TestStore } from '../../testutils/ngrx-test-store';
import { SnackBarService } from '../core/services';
import { State } from '../root-store';
import { AuthService } from '../shared/services/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let store: TestStore<State>;
  let authService;
  let authSubj: Subject<any>;

  beforeEach(async(() => {
    authSubj = new Subject();
    authService = {
      generateKey: jasmine.createSpy().and.returnValue(of(null)),
      login: jasmine.createSpy().and.returnValue(authSubj),
    };

    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [LoginComponent, MockTranslatePipe],
      providers: [
        { provide: SnackBarService, useClass: MockSnackBarService },
        {
          provide: AuthService,
          useValue: authService,
        },
        {
          provide: Store,
          useClass: TestStore,
        },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParams: {} } },
        },
        {
          provide: Router,
          useValue: {
            navigateByUrl: jasmine.createSpy(),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function findSubmitButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button[type="submit"]');
  }

  function clickSubmit() {
    findSubmitButton().click();
    fixture.detectChanges();
  }

  async function fillForm() {
    component.username = 'username';
    component.password = 'password';

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function findSpinner(): HTMLElement | null {
    return fixture.nativeElement.querySelector('mat-spinner');
  }

  it('should show a loading indicator when logging in', async () => {
    expect(component.loading).toBe(false);
    expect(findSubmitButton().textContent.trim()).toBe('AUTH.LOGIN');
    expect(findSpinner()).toBeNull();

    await fillForm();
    clickSubmit();
    expect(component.loading).toBe(true);
    expect(findSubmitButton().textContent.trim()).toBe('\u200b');
    expect(findSpinner()).not.toBeNull();
  });

  it('should disable submit button when login is in progress', async () => {
    await fillForm();
    expect(findSubmitButton().disabled).toBe(false);

    clickSubmit();
    expect(findSubmitButton().disabled).toBe(true);

    authSubj.next(null);
    authSubj.complete();
    fixture.detectChanges();
    expect(findSubmitButton().disabled).toBe(false);
  });
});
