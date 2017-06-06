import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { toBoolean } from '@angular-mdl/core/components/common/boolean-property';

@Component({
  selector: 'cs-character-count-textfield',
  template: `
    <mdl-textfield
      [(ngModel)]="value"
      [autofocus]="autofocus"
      [type]="type"
      [label]="label"
      [pattern]="pattern"
      [min]="min"
      [max]="max"
      [name]="name"
      [maxlength]="maxlength"
      [required]="required"
      [floating-label]="floatingLabel"
      #model="ngModel"
      [class.is-invalid]="model.invalid && !model.pristine"
    >
    </mdl-textfield>
    <span class="character-count" *ngIf="maxlength">
      {{ value?.length || 0 }}/{{ maxlength }}
    </span>
  `,
  styles: [`
    :host {
      position: relative;
      display: block;
    }
    
    :host /deep/ mdl-textfield {
      width: 100%;
    }
    
    .character-count {
      position: absolute;
      bottom: 0;
      right: 0;
      font-size: 0.9em;
    }
  `],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CharacterCountTextfieldComponent),
    multi: true
  }],
})
export class CharacterCountTextfieldComponent implements ControlValueAccessor {
  public _value: string;
  @Input() public type = 'text';
  @Input() public label;
  @Input() public pattern;
  @Input() public min;
  @Input() public max;
  @Input() public name;
  @Input() public maxlength;
  @Input('floating-label') public floatingLabel; // tslint:disable-line
  private _required = false;
  private _autofocus = false;

  public propagateChange: any = () => {};

  @Input() public get required(): boolean {
    return this._required;
  }

  public set required(val) {
    this._required = toBoolean(val);
  }

  @Input() public get autofocus(): boolean {
    return this._autofocus;
  }

  public set autofocus(val) {
    this._autofocus = toBoolean(val);
  }

  @Input()
  public get value(): string {
    return this._value;
  }

  public set value(value) {
    this._value = value;
    this.propagateChange(this.value);
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void { }

  public writeValue(value: any): void {
    if (value) {
      this.value = value;
    }
  }
}
