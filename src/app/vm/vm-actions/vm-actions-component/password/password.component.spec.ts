import { ChangeDetectorRef, NO_ERRORS_SCHEMA, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockTranslatePipe } from '../../../../../testutils/mocks/mock-translate.pipe.spec';

import { PasswordComponent } from './password.component';

describe('PasswordComponent', () => {
  let component: PasswordComponent;
  let fixture: ComponentFixture<PasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PasswordComponent, MockTranslatePipe],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function detectChanges() {
    fixture.debugElement.injector.get(ChangeDetectorRef as Type<ChangeDetectorRef>).markForCheck();
    fixture.detectChanges();
  }

  function setPassword(password: string | undefined) {
    component.password = password;
    detectChanges();
  }

  function findInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector('input');
  }

  function findToggle(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button');
  }

  function findIcon(): HTMLElement {
    return fixture.nativeElement.querySelector('mat-icon');
  }

  it('should show `Not Set` when password is not given', () => {
    setPassword(undefined);
    expect(findInput()).toBeNull();
    expect(findToggle()).toBeNull();
    expect(fixture.nativeElement.textContent.trim()).toBe('VM_POST_ACTION.NOT_SET');
  });

  it('should show an input with the password otherwise', () => {
    setPassword('password');
    expect(findInput()).not.toBeNull();
    expect(findInput().value).toBe('password');
  });

  it('should hide the password by default', () => {
    setPassword('pass');

    expect(component.visible).toBe(false);
    expect(findInput().type).toBe('password');
    expect(findIcon().classList).toContain('mdi-eye');
    expect(findIcon().classList).not.toContain('mdi-eye-off');
  });

  it('should toggle visibility', () => {
    setPassword('pass');

    findToggle().click();
    detectChanges();

    expect(component.visible).toBe(true);
    expect(findInput().type).toBe('text');
    expect(findIcon().classList).toContain('mdi-eye-off');
    expect(findIcon().classList).not.toContain('mdi-eye');
  });
});
