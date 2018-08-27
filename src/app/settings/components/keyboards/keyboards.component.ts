import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export enum KeyboardLayout {
  us = 'us',
  uk = 'uk',
  jp = 'jp',
  sc = 'sc'
}

@Component({
  selector: 'cs-keyboards',
  templateUrl: 'keyboards.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => KeyboardsComponent),
      multi: true
    }
  ]
})
export class KeyboardsComponent implements ControlValueAccessor {
  private _keyboardLayout: KeyboardLayout;
  public keyboardLayouts = [
    {
      value: KeyboardLayout.us,
      name: 'VM_PAGE.VM_CREATION.KB_US'
    },
    {
      value: KeyboardLayout.uk,
      name: 'VM_PAGE.VM_CREATION.KB_UK'
    },
    {
      value: KeyboardLayout.jp,
      name: 'VM_PAGE.VM_CREATION.KB_JP'
    },
    {
      value: KeyboardLayout.sc,
      name: 'VM_PAGE.VM_CREATION.KB_SC'
    }
  ];

  @Input()
  public get keyboardLayout(): KeyboardLayout {
    return this._keyboardLayout;
  }

  public set keyboardLayout(layout: KeyboardLayout) {
    this._keyboardLayout = layout;
    this.propagateChange(this.keyboardLayout);
  }

  public propagateChange: any = () => {
  };

  public writeValue(value): void {
    if (value) {
      this.keyboardLayout = value;
    }
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void {
  }
}
