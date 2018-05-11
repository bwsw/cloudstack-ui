import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { integerValidator } from '../../directives/integer-validator';

@Component({
  selector: 'cs-slider',
  templateUrl: 'slider.component.html',
  styleUrls: ['slider.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderComponent),
      multi: true
    }
  ]
})
export class SliderComponent implements OnInit, ControlValueAccessor {
  @Input() public label: string;
  @Input() public min: number;
  @Input() public max: number;
  @Input() public units: string;

  public _size: number;
  public validators = [Validators.required, integerValidator()];
  public validatorMessages = {
    'required': 'VM_PAGE.STORAGE_DETAILS.VOLUME_RESIZE.SIZE_IS_REQUIRED',
    'min': 'VM_PAGE.STORAGE_DETAILS.VOLUME_RESIZE.BETWEEN',
    'max': 'VM_PAGE.STORAGE_DETAILS.VOLUME_RESIZE.BETWEEN',
    'integerValidator': 'VM_PAGE.STORAGE_DETAILS.VOLUME_RESIZE.INTEGER'
  };

  public email = new FormControl();

  constructor() {
  }

  public ngOnInit(): void {
    if (this.min == null) {
      throw new Error('Attribute \'min\' is required');
    }

    if (this.max == null) {
      throw new Error('Attribute \'max\' is required');
    }
    this.validators.push(Validators.min(this.min));
    this.validators.push(Validators.max(this.max));
  }

  public propagateChange: any = () => {};

  @Input()
  public get size(): number {
    return this._size;
  }

  public set size(value) {
    this._size = Math.floor(value);
    this.propagateChange(this.size);
  }

  public get sliderValue(): number {
    return this.size > this.min ? this.size : this.min;
  }

  public handleSliderChange(newValue: number): void {
    if (newValue > this.max) {
      this.size = this.max + 1;
      // setTimeout is used to force rerendering
      setTimeout(() => this.size = this.max);
      return;
    }
    this.size = newValue;
  }

  public writeValue(value): void {
    if (value) {
      this.size = value;
    }
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void { }
}
