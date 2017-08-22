import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

interface NamedLayout {
  value: KeyboardLayout;
  name: string;
}

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
export class KeyboardsComponent implements ControlValueAccessor, OnInit {
  public translatedLayouts: Array<NamedLayout>;

  private _keyboardLayout: KeyboardLayout;
  private keyboardLayouts = [
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

  constructor(private translateService: TranslateService) {}

  public ngOnInit(): void {
    this.getTranslatedLayouts().subscribe(translatedLayouts => {
      this.translatedLayouts = translatedLayouts;
    });
  }

  @Input()
  public get keyboardLayout(): KeyboardLayout {
    return this._keyboardLayout;
  }

  public set keyboardLayout(layout: KeyboardLayout) {
    if (layout) {
      this._keyboardLayout = layout;
      this.propagateChange(this.keyboardLayout);
    }
  }

  public propagateChange: any = () => {};

  public writeValue(value): void {
    if (value) {
      this.keyboardLayout = value;
    }
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void {}

  private getTranslatedLayouts(): Observable<Array<NamedLayout>> {
    const layouts = this.keyboardLayouts.map(_ => _.name);
    return this.translateService.get(layouts).map(translatedLayouts => {
      return this.keyboardLayouts.map(layout => {
        layout['name'] = translatedLayouts[layout['name']];
        return layout;
      });
    });
  }
}
