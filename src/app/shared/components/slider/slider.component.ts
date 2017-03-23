import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


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
  @Input() public isLogarithmic = true;
  @Input() public label: string;
  @Input() public min: number;
  @Input() public max: number;
  @Input() public units: string;

  public _size: number;

  public ngOnInit(): void {
    if (this.min == null) {
      throw new Error('Attribute \'min\' is required');
    }

    if (this.max == null) {
      throw new Error('Attribute \'max\' is required');
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
    if (this.isLogarithmic) {
      return this.size > this.min ? Math.log(this.size) : this.sliderMinValue;
    }
    return this.size > this.min ? this.size : this.sliderMinValue;
  }

  public get sliderMinValue(): number {
    if (this.isLogarithmic) {
      return Math.log(this.min);
    }
    return this.min;
  }

  public get sliderMaxValue(): number {
    if (this.isLogarithmic) {
      return Math.log(this.max);
    }
    return this.max;
  }

  public handleSliderChange(event: number): void {
    this.isLogarithmic ? this.onVolumeChangeExp(event) : this.onVolumeChange(event);
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

  public onVolumeChange(newValue: number): void {
    if (newValue > this.max) {
      this.size = this.max + 1;
      // setTimeout is used to force rerendering
      setTimeout(() => this.size = this.max);
      return;
    }
    this.size = newValue;
  }

  public onVolumeChangeExp(newValue: number): void {
    this.onVolumeChange(Math.exp(newValue));
  }

  public onBlur(e: Event): void {
    if (+(e.currentTarget as HTMLInputElement).value < this.min) {
      this.size = this.size + 1;

      // setTimeout is used to force rerendering
      setTimeout(() => this.size = this.min);
    }
  }
}
