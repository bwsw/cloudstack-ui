import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';


type KeyboardLayout = 'us' | 'uk' | 'jp' | 'sc';
type NamedLayout = { value: KeyboardLayout, name: string };
const KeyboardLayouts = {
  us: 'us' as KeyboardLayout,
  uk: 'uk' as KeyboardLayout,
  jp: 'jp' as KeyboardLayout,
  sc: 'sc' as KeyboardLayout
};

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
      value: KeyboardLayouts.us,
      name: 'KB_US'
    },
    {
      value: KeyboardLayouts.uk,
      name: 'KB_UK'
    },
    {
      value: KeyboardLayouts.jp,
      name: 'KB_JP'
    },
    {
      value: KeyboardLayouts.sc,
      name: 'KB_SC'
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

  public registerOnTouched(): void { }

  private getTranslatedLayouts(): Observable<Array<NamedLayout>> {
    const layouts = this.keyboardLayouts.map(_ => _.name);
    return this.translateService.get(layouts)
      .map(translatedLayouts => {
        return this.keyboardLayouts.map(layout => {
          layout['name'] = translatedLayouts[layout['name']];
          return layout;
        });
      });
  }
}
