import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { InputTypeNumberDirective } from './input-type-number.directive';
import { FormsModule } from '@angular/forms';

// workaround! https://github.com/angular/zone.js/issues/1050
// This declaration used because Angular's fakeAsync and tick functions don't work as expected with lodash's debounce
declare let Zone: any;
const async = Zone[Zone.__symbol__('asyncTest')];
const { fakeAsync, tick } = Zone[Zone.__symbol__('fakeAsyncTest')];


@Component({
  template: `
  <input
    type="number"
    class="input"
    [csMinValue]="minValue"
    [csMaxValue]="maxValue"
    [step]="step"
    [(ngModel)]="value"
  >
  `
})
class TestComponent {
  public minValue = null;
  public maxValue = null;
  public step = null;
  public value: number;
}

describe('InputTypeNumberDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let inputEl: HTMLInputElement;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [ TestComponent, InputTypeNumberDirective ],
      imports: [ FormsModule ]
    }).createComponent(TestComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    const inputDebugElement = fixture.debugElement.query(By.css('input'));
    inputEl = inputDebugElement.nativeElement;
  });

  describe('should allow the input of', () => {
    it('positive numeric values', () => {
      inputEl.value = '546';
      inputEl.dispatchEvent(new Event('input'));
      expect(inputEl.value).toBe('546');
    });

    it('negative numeric values', () => {
      inputEl.value = '-546';
      inputEl.dispatchEvent(new Event('input'));
      expect(inputEl.value).toBe('-546');
    });
  });

  it('should not allow the input of non-numeric values', () => {
    inputEl.value = 'bwsw';
    inputEl.dispatchEvent(new Event('input'));
    expect(inputEl.value).toBe('');

    inputEl.value = '-1.5.4';
    inputEl.dispatchEvent(new Event('input'));
    expect(inputEl.value).toBe('');

    inputEl.value = '12sw';
    inputEl.dispatchEvent(new Event('input'));
    expect(inputEl.value).toBe('');
  });

  it('should set the minimum value after 1 second if current value are beyond the minimum limit', fakeAsync(() => {
    component.minValue = 10;
    fixture.detectChanges();

    inputEl.value = '8';
    inputEl.dispatchEvent(new Event('input'));
    tick(1000);
    expect(inputEl.value).toBe(component.minValue.toString());
  }));

  it('should set the maximum value immediately if current value are beyond the maximum limit', () => {
    component.maxValue = 1000;
    fixture.detectChanges();

    inputEl.value = '777';
    inputEl.dispatchEvent(new Event('input'));
    expect(inputEl.value).toBe('777');

    inputEl.value = '7777';
    inputEl.dispatchEvent(new Event('input'));
    expect(inputEl.value).toBe(component.maxValue.toString());
  });

  describe('should not allow not integer values', () => {
    it('by default', () => {
      inputEl.value = '1.5';
      inputEl.dispatchEvent(new Event('input'));
      expect(inputEl.value).toBe('15');
    });

    it('when step attribute has an integer value', () => {
      component.step = 2;
      fixture.detectChanges();

      inputEl.value = '1.5';
      inputEl.dispatchEvent(new Event('input'));
      expect(inputEl.value).toBe('15');
    });
  });

  it('should allow not integer values when step attribute has not integer value', () => {
    component.step = 0.1;
    fixture.detectChanges();

    inputEl.value = '1.5';
    inputEl.dispatchEvent(new Event('input'));
    expect(inputEl.value).toBe('1.5');
  });

  it('should return a numeric value via ngModel', () => {
    inputEl.value = '546';
    inputEl.dispatchEvent(new Event('input'));
    expect(component.value).toBe(546);
  });

  it('should return only the changed value via ngModel', fakeAsync(() => {
    component.minValue = 10;
    component.maxValue = 100;
    fixture.detectChanges();

    inputEl.value = '2';
    inputEl.dispatchEvent(new Event('input'));
    expect(component.value).toBe(undefined);
    tick(1000);
    expect(component.value).toBe(component.minValue);


    inputEl.value = '546';
    inputEl.dispatchEvent(new Event('input'));
    expect(component.value).toBe(component.maxValue);
  }));
});
