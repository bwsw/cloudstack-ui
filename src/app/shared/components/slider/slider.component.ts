import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'cs-slider',
  templateUrl: 'slider.component.html',
  styleUrls: ['slider.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderComponent),
      multi: true,
    },
  ],
})
export class SliderComponent implements OnInit, ControlValueAccessor {
  @Input()
  public label: string;
  @Input()
  public min: number;
  @Input()
  public max: number;
  @Input()
  public units: string;

  // tslint:disable-next-line:variable-name
  public _size: number;

  constructor() {}

  public ngOnInit(): void {
    if (this.min == null) {
      throw new Error("Attribute 'min' is required");
    }

    if (this.max == null) {
      throw new Error("Attribute 'max' is required");
    }
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
      setTimeout(() => (this.size = this.max));
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

  public registerOnTouched(): void {}

  public onBlur(e: Event): void {
    const sliderElementValue = +(e.currentTarget as HTMLInputElement).value;

    if (sliderElementValue < this.min) {
      this.size = this.size + 1;

      // setTimeout is used to force rerendering
      setTimeout(() => (this.size = this.min));
    }
  }
}
