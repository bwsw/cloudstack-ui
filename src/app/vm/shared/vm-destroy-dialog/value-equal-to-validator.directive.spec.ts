import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ValueEqualToValidatorDirective } from './value-equal-to-validator.directive';

describe('ValueEqualToValidatorDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  @Component({
    template: `
      <input [(ngModel)]="val" [csValueEqualTo]="expectedVal" />
    `,
  })
  class TestComponent {
    val = '';

    expectedVal = 'test value';
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [TestComponent, ValueEqualToValidatorDirective],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function getFormControl(): NgControl {
    return fixture.debugElement.query(By.css('input')).injector.get(NgControl);
  }

  async function setInputValue(value: string) {
    component.val = value;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('should mark the control as invalid if its value is not equal to expected', async () => {
    await setInputValue('definitely not the expected value');
    expect(getFormControl().invalid).toBe(true);
    expect(getFormControl().errors).toEqual({
      valueEqualTo: {
        expected: component.expectedVal,
        actual: component.val,
      },
    });
  });

  it('should not set any errors if value is expected', async () => {
    await setInputValue(component.expectedVal);
    expect(getFormControl().invalid).toBe(false);
  });

  it('should allow empty value in case the control is optional', async () => {
    await setInputValue('');
    expect(getFormControl().invalid).toBe(false);
  });

  it('should bypass validation if expected value is empty', async () => {
    component.expectedVal = '';
    fixture.detectChanges();
    await setInputValue('some value');

    expect(getFormControl().invalid).toBe(false);
  });
});
