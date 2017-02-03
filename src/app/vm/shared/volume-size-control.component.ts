import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'cs-volume-size-control',
  templateUrl: 'volume-size-control.component.html',
  styleUrls: ['volume-size-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VolumeSizeControlComponent),
      multi: true
    }
  ]
})
export class VolumeSizeControlComponent implements OnInit, ControlValueAccessor {
  @Input() public min: number;
  @Input() public max: number;

  private _size: number;

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
  public get size() {
    return this._size;
  }

  public set size(value) {
    this._size = value;
    this.propagateChange(value);
  }

  public writeValue(value): void {
    if (value) {
      this.size = value;
    }
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public registerOnTouched() { }

  public onVolumeChange(newValue: number): void {
    if (newValue > this.max) {
      this.size = this.max + 1;
      // setTimeout is used to force rerendering
      setTimeout(() => this.size = this.max);
      return;
    }
    this.size = newValue;
  }

  public onBlur(e: Event): void {
    if (+(e.currentTarget as HTMLInputElement).value < this.min) {
      this.size = this.size + 1;

      // setTimeout is used to force rerendering
      setTimeout(() => this.size = this.min);
    }
  }
}
