import { MdlPopoverComponent } from '@angular-mdl/popover';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Color } from '../../models';


@Component({
  selector: 'cs-color-picker',
  templateUrl: 'color-picker.component.html',
  styleUrls: ['color-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerComponent),
      multi: true
    }
  ]
})

export class ColorPickerComponent implements OnChanges, ControlValueAccessor {
  @Input() public colors: Array<Color>;
  @Input() public colorsPerLine: number;
  @Input() public containerWidth = 256;
  @Output() public change = new EventEmitter();
  @ViewChild(MdlPopoverComponent) public popover;
  public colorWidth: number;

  private _selectedColor: Color;
  private _disabled: boolean;

  @Input() public get disabled(): boolean {
    return this._disabled;
  };

  public set disabled(value) {
    this._disabled = coerceBooleanProperty(value);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if ('colors' in changes) {
      this.colorsPerLine = null;
    }
    this.updateParams();
  }

  @Input() public get selectedColor(): Color {
    return this._selectedColor;
  }

  public set selectedColor(val) {
    this._selectedColor = val;
    this.propagateChange(this._selectedColor);
  }

  public toggle(event: Event): void {
    if (!this._disabled) {
      this.popover.toggle(event);
    }
  }

  public selectColor(color: Color): void {
    this.selectedColor = color;
    this.popover.hide();
    this.change.emit(this._selectedColor);
  }

  public writeValue(value): void {
    if (value) {
      this.selectedColor = value;
    }
  }

  public propagateChange: any = () => {};
  public registerOnTouched(): any {}

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  private updateParams(): void {
    if (!this.colors) {
      return;
    }
    this.colorsPerLine = this.colorsPerLine
      ? Math.min(this.colorsPerLine, this.colors.length)
      : Math.ceil(Math.sqrt(this.colors.length));

    this.colorWidth = this.containerWidth / this.colorsPerLine;
  }
}
