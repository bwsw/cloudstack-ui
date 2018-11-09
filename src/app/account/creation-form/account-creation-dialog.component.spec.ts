import { Component, forwardRef, Input, ViewChild } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatButtonModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatTooltipModule,
} from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { AccountCreationDialogComponent } from './account-creation-dialog.component';
import { Domain } from '../../shared/models/domain.model';
import { Role } from '../../shared/models/role.model';
import { MockTranslatePipe } from '../../../testutils/mocks/mock-translate.pipe.spec';
import { MockTranslateService } from '../../../testutils/mocks/mock-translate.service.spec';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { AccountData } from '../../shared/models/account.model';

@Component({
  selector: 'cs-test',
  template: `
    <cs-account-creation-dialog
      [domains]="domains"
      [roles]="roles"
      (accountCreated)="accountCreate($event)"
    ></cs-account-creation-dialog>
  `,
})
class TestComponent {
  @ViewChild(AccountCreationDialogComponent)
  public accountComponent: AccountCreationDialogComponent;
  public domains: Domain[];
  public roles: Role[];

  public accountCreate(account: AccountData) {}
}

@Component({
  selector: 'cs-time-zone',
  template: `<mat-form-field>
    <mat-select [(ngModel)]="timeZone">
      <mat-option>value
      </mat-option>
    </mat-select>
  </mat-form-field>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TestTimeZoneComponent),
      multi: true,
    },
  ],
})
class TestTimeZoneComponent implements ControlValueAccessor {
  public writeValue(value: any) {}
  public registerOnChange(fn): void {}
  public registerOnTouched(): void {}
}

@Component({
  selector: 'cs-overlay-loading',
  template: ``,
})
class TestOverlayComponent {
  @Input()
  public active: boolean;
}

describe('AccountCreationDialogComponent', () => {
  function createTestComponent() {
    const f = TestBed.createComponent(TestComponent);
    const testComponent = f.componentInstance;

    return { f, testComponent };
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatTooltipModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
      ],
      declarations: [
        AccountCreationDialogComponent,
        TestTimeZoneComponent,
        TestOverlayComponent,
        TestComponent,
        MockTranslatePipe,
      ],
      providers: [{ provide: TranslateService, useClass: MockTranslateService }],
    }).compileComponents();
  }));

  it('should check the submit button is disabled', async(async () => {
    const { f, testComponent } = createTestComponent();

    await f.whenStable();
    f.detectChanges();

    expect(testComponent.accountComponent.accountForm).toBeDefined();
    expect(testComponent.accountComponent.accountForm.valid).toBeFalsy();

    const buttons = f.debugElement.queryAll(By.css('button'));
    expect(buttons[1].nativeElement.disabled).toBeTruthy();
  }));

  it('should check the submit button is enabled', async(async () => {
    const { f, testComponent } = createTestComponent();

    await f.whenStable();
    f.detectChanges();
    expect(testComponent.accountComponent.accountForm.valid).toBeFalsy();
    const buttons = f.debugElement.queryAll(By.css('button'));
    expect(buttons[1].nativeElement.disabled).toBeTruthy();
    testComponent.accountComponent.accountForm.controls['username'].setValue('name1');
    testComponent.accountComponent.accountForm.controls['email'].setValue('email@email');
    testComponent.accountComponent.accountForm.controls['password'].setValue('password');
    testComponent.accountComponent.accountForm.controls['firstname'].setValue('name');
    testComponent.accountComponent.accountForm.controls['lastname'].setValue('name');
    testComponent.accountComponent.accountForm.controls['domainid'].setValue('1');
    testComponent.accountComponent.accountForm.controls['roleid'].setValue('1');
    f.detectChanges();
    expect(buttons[1].nativeElement.disabled).toBeFalsy();
  }));

  it('should check the email field', async(async () => {
    const { f, testComponent } = createTestComponent();

    await f.whenStable();
    f.detectChanges();
    expect(testComponent.accountComponent.accountForm.valid).toBeFalsy();
    const buttons = f.debugElement.queryAll(By.css('button'));
    expect(buttons[1].nativeElement.disabled).toBeTruthy();
    testComponent.accountComponent.accountForm.controls['username'].setValue('name1');
    testComponent.accountComponent.accountForm.controls['email'].setValue('email');
    testComponent.accountComponent.accountForm.controls['password'].setValue('password');
    testComponent.accountComponent.accountForm.controls['firstname'].setValue('name');
    testComponent.accountComponent.accountForm.controls['lastname'].setValue('name');
    testComponent.accountComponent.accountForm.controls['domainid'].setValue('1');
    testComponent.accountComponent.accountForm.controls['roleid'].setValue('1');
    f.detectChanges();
    expect(buttons[1].nativeElement.disabled).toBeTruthy();
  }));

  it('should submit form', async(async () => {
    const { f, testComponent } = createTestComponent();
    const spyCreate = spyOn(testComponent, 'accountCreate').and.callThrough();

    await f.whenStable();
    f.detectChanges();
    expect(testComponent.accountComponent.accountForm.valid).toBeFalsy();
    const buttons = f.debugElement.queryAll(By.css('button'));
    testComponent.accountComponent.accountForm.controls['username'].setValue('name1');
    testComponent.accountComponent.accountForm.controls['email'].setValue('email@email');
    testComponent.accountComponent.accountForm.controls['password'].setValue('password');
    testComponent.accountComponent.accountForm.controls['firstname'].setValue('name');
    testComponent.accountComponent.accountForm.controls['lastname'].setValue('name');
    testComponent.accountComponent.accountForm.controls['domainid'].setValue('1');
    testComponent.accountComponent.accountForm.controls['roleid'].setValue('1');
    f.detectChanges();
    expect(buttons[1].nativeElement.disabled).toBeFalsy();
    buttons[1].nativeElement.click();
    expect(spyCreate).toHaveBeenCalledWith({
      username: 'name1',
      email: 'email@email',
      password: 'password',
      firstname: 'name',
      lastname: 'name',
      domainid: '1',
      roleid: '1',
    });
  }));

  it('should submit full form', async(async () => {
    const { f, testComponent } = createTestComponent();
    const spyCreate = spyOn(testComponent, 'accountCreate').and.callThrough();

    await f.whenStable();
    f.detectChanges();
    const buttons = f.debugElement.queryAll(By.css('button'));
    testComponent.accountComponent.accountForm.controls['username'].setValue('name1');
    testComponent.accountComponent.accountForm.controls['email'].setValue('email@email');
    testComponent.accountComponent.accountForm.controls['password'].setValue('password');
    testComponent.accountComponent.accountForm.controls['firstname'].setValue('name');
    testComponent.accountComponent.accountForm.controls['lastname'].setValue('name');
    testComponent.accountComponent.accountForm.controls['domainid'].setValue('1');
    testComponent.accountComponent.accountForm.controls['roleid'].setValue('1');
    testComponent.accountComponent.accountForm.controls['timezone'].setValue({ geo: 'GEO' });
    testComponent.accountComponent.accountForm.controls['networkdomain'].setValue('domain');
    f.detectChanges();
    expect(buttons[1].nativeElement.disabled).toBeFalsy();
    buttons[1].nativeElement.click();
    expect(spyCreate).toHaveBeenCalledWith({
      username: 'name1',
      email: 'email@email',
      password: 'password',
      firstname: 'name',
      lastname: 'name',
      domainid: '1',
      roleid: '1',
      timezone: 'GEO',
      networkdomain: 'domain',
    });
  }));
});
