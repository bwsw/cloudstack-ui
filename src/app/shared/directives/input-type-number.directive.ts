import { Directive, ElementRef, forwardRef, HostListener, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cancel, debounce } from 'typescript-debounce-decorator';

/*
 * This directive is used to prevent user to the entry of the text values into the
 * numeric input field and to limit the possibility of entering numbers beyond the
 * boundaries settled by "csMaxValue" and "csMinValue"
 */

// tslint:disable:directive-selector no-input-rename
export const INPUT_NUMBER_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputTypeNumberDirective),
  multi: true
};

@Directive({
  selector: 'input[type=number]',
  providers: [INPUT_NUMBER_ACCESSOR]
})
export class InputTypeNumberDirective implements ControlValueAccessor {
  @Input('csMinValue') minValue: string | number = null;
  @Input('csMaxValue') maxValue: string | number = null;
  @Input() step = '1';
  private floatNumbersRegEx: RegExp = /(?!-)[^\d.]*/g; // Remove all symbols expect digit symbols, "-", "."
  private integerNumbersRegEx: RegExp = /(?!-)[^\d]*/g; // Remove all symbols expect digit symbols, "-"
  private onChange = (value: string) => {
  }
  private onTouched = () => {
  }

  constructor(private el: ElementRef) {
  }

  @HostListener('input') onInputEvent() {
    cancel(this.setMinValueDebounced);
    const initialValue = this.el.nativeElement.value;
    // Workaround! If user enter "-" in empty input or "." then initialValue = ''
    // This is input type=text bug, so if initialValue empty don't do anything
    if (!initialValue) {
      return;
    }
    const regex = this.isInteger() ? this.integerNumbersRegEx : this.floatNumbersRegEx;
    const processedValue = initialValue.replace(regex, '');
    const value: string = isNaN(processedValue) ? this.minValue.toString() : processedValue;
    this.updateValue(value);
  }

  @HostListener('change') onChangeEvent() {
    this.onChangeAndBlurEvents();
  }

  @HostListener('blur') onBlurEvent() {
    this.onChangeAndBlurEvents();
    this.onTouched();
  }

  public writeValue(value: string): void {
    this.el.nativeElement.value = value;
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  private updateValue(newValue: string): void {
    // This allows you delete last symbol
    if (!newValue) {
      return this.updateElementValue(newValue);
    }

    const value: number = +newValue;

    if (this.isLowerThanMinValue(value)) {
      return this.setMinValueDebounced();
    } else if (this.isGreaterThanMaxValue(value)) {
      return this.setMaxValue();
    } else {
      this.updateElementValue(newValue);
    }
  }

  private onChangeAndBlurEvents() {
    const value = this.el.nativeElement.value;
    if (!value && this.minValue !== null) {
      this.setMinValue();
    } else if (!value) {
      // Workaround! For type=text minus bug
      this.updateElementValue('');
    }
  }

  // Debounce allows, for example, to enter 11 if the minimum value is 2.
  // Otherwise, the first unit will be changed to a minimum value of 2 and it will be 21
  @debounce(500, {leading: false})
  private setMinValueDebounced() {
    this.setMinValue();
  }

  private setMaxValue() {
    this.updateElementValue(this.maxValue.toString());
  }

  private setMinValue() {
    this.updateElementValue(this.minValue.toString());
  }

  private updateElementValue(value: string) {
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
