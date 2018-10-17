import { Directive, ElementRef, forwardRef, HostListener, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as debounce from 'lodash/debounce';

/*
 * This directive is used to prevent user to the entry of the text values into the
 * numeric input field and to limit the possibility of entering numbers beyond the
 * boundaries settled by "csMaxValue" and "csMinValue"
 */

// tslint:disable:directive-selector no-input-rename no-use-before-declare
export const INPUT_NUMBER_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputTypeNumberDirective),
  multi: true,
};

@Directive({
  selector: 'input[type=number]',
  providers: [INPUT_NUMBER_ACCESSOR],
})
export class InputTypeNumberDirective implements ControlValueAccessor {
  @Input('csMinValue')
  minValue: string | number = null;
  @Input('csMaxValue')
  maxValue: string | number = null;
  @Input()
  step = '1';
  private floatNumbersRegEx: RegExp = /(?!-)[^\d.]*/g; // Remove all symbols expect digit symbols, "-", "."
  private integerNumbersRegEx: RegExp = /(?!-)[^\d]*/g; // Remove all symbols expect digit symbols, "-"
  // Debounce allows, for example, to enter 11 if the minimum value is 2.
  // Otherwise, the first unit will be changed to a minimum value of 2 and it will be 21
  private setMinValueDebounced = debounce(this.setMinValue, 1000);

  constructor(private el: ElementRef) {}

  @HostListener('input')
  onInputEvent() {
    this.setMinValueDebounced.cancel();
    const initialValue = this.el.nativeElement.value;
    // Workaround! If user enter "-" in empty input or "." then initialValue = ''
    // This is input type=text bug, so if initialValue empty don't do anything
    if (!initialValue) {
      return;
    }
    const regex = this.isInteger() ? this.integerNumbersRegEx : this.floatNumbersRegEx;
    const processedValue = initialValue.replace(regex, '');
    const value: number = isNaN(processedValue) ? +this.minValue : +processedValue;
    this.updateValue(value);
  }

  @HostListener('change')
  onChangeEvent() {
    this.onChangeAndBlurEvents();
  }

  @HostListener('blur')
  onBlurEvent() {
    this.onChangeAndBlurEvents();
    this.onTouched();
  }

  public writeValue(value: number): void {
    this.el.nativeElement.value = value;
  }

  public registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  private onChange = (value: number) => {};

  private onTouched = () => {};

  private updateValue(value: number): void {
    // This allows you delete last symbol
    if (value == null) {
      return this.updateElementValue(value);
    }

    if (this.isLowerThanMinValue(value)) {
      return this.setMinValueDebounced();
    }
    if (this.isGreaterThanMaxValue(value)) {
      return this.setMaxValue();
    }

    this.updateElementValue(value);
  }

  private onChangeAndBlurEvents() {
    const value = this.el.nativeElement.value;
    if (!value && this.minValue !== null) {
      this.setMinValue();
    } else if (!value) {
      // Workaround! For type=text minus bug
      this.updateElementValue(null);
    }
  }

  private setMaxValue() {
    this.updateElementValue(+this.maxValue);
  }

  private setMinValue() {
    this.updateElementValue(+this.minValue);
  }

  private updateElementValue(value: number) {
    this.writeValue(value);
    this.onChange(value); // This need to get value through 'change' event
  }

  private isGreaterThanMaxValue(value: number): boolean {
    const maxValue: number = this.maxValue !== null ? +this.maxValue : null;
    return maxValue !== null && maxValue < value;
  }

  private isLowerThanMinValue(value: number): boolean {
    const minValue: number = this.minValue !== null ? +this.minValue : null;
    return minValue !== null && minValue > value;
  }

  private isInteger(): boolean {
    const step = +this.step;
    if (isNaN(step)) {
      return true;
    }
    return step % 1 === 0;
  }
}
