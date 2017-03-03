import {
  Component,
  ChangeDetectorRef,
  ContentChildren,
  EventEmitter,
  forwardRef,
  Input,
  ModuleWithProviders,
  NgModule,
  Output,
  QueryList,
  ViewChild,
  ViewEncapsulation,
  HostListener
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MdlOptionComponent } from '@angular2-mdl-ext/select';
import { MdlPopoverComponent, MdlPopoverModule } from '@angular2-mdl-ext/popover';

const uniq = (array: any[]) => Array.from(new Set(array));

function toBoolean (value:any): boolean {
  return value != null && `${value}` !== 'false';
}

function randomId() {
  const S4 = () => (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  return (S4()+S4());
}

const MDL_SELECT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MdlAutocompleteComponent),
  multi: true
};

@Component({
  selector: 'mdl-autocomplete',
  host: {
    '[class.mdl-select]': 'true',
    '[class.mdl-select--floating-label]': 'isFloatingLabel',
    '[class.has-placeholder]': 'placeholder'
  },
  templateUrl: 'mdl-autocomplete.component.html',
  styleUrls: ['mdl-autocomplete.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [MDL_SELECT_VALUE_ACCESSOR]
})
export class MdlAutocompleteComponent implements ControlValueAccessor {
  @Input() ngModel: any;
  @Input() disabled: boolean = false;
  @Input() public label: string = '';
  @Input('floating-label')
  get isFloatingLabel() { return this._isFloatingLabel; }
  set isFloatingLabel(value) { this._isFloatingLabel = toBoolean(value); }
  @Input() placeholder: string = '';
  @Input() multiple: boolean = false;
  @Output() private change: EventEmitter<any> = new EventEmitter(true);
  @ViewChild(MdlPopoverComponent) public popover: MdlPopoverComponent;
  @ContentChildren(MdlOptionComponent) public options: QueryList<MdlOptionComponent>;
  private _isFloatingLabel: boolean = false;
  private textfieldId: string;
  private text: string = '';
  private textByValue: any = {};
  private onChange: any = Function.prototype;
  private onTouched: any = Function.prototype;
  private focused: boolean = false;

  constructor(private changeDetectionRef: ChangeDetectorRef) {
    this.textfieldId = `mdl-textfield-${randomId()}`;
  }

  public ngOnInit() {
    this.popover.hide = () => {
      this.popover.isVisible = false;
      this.onSelect(null, this.getNewValueOnLeave());
      let opts = this.options.toArray();
      for (let i = 0; i < opts.length; i++) {
        if (this.ngModel === opts[i].value) {
          this.text = opts[i].text;
          return;
        }
      }
      this.text = this.ngModel;
    };
  }

  public ngAfterViewInit() {
    this.bindOptions();
    this.renderValue(this.ngModel);
    this.options.changes.subscribe(() => {
      this.bindOptions();
      this.renderValue(this.ngModel);
    });
  }

  @HostListener('document:keydown', ['$event'])
  public onKeydown($event: KeyboardEvent): void {
    if (!this.disabled && this.popover.isVisible) {
      let closeKeys: Array<string> = ["Escape", "Tab", "Enter"];
      let closeKeyCodes: Array<Number> = [13, 27, 9];
      if (closeKeyCodes.indexOf($event.keyCode) != -1 || ($event.key && closeKeys.indexOf($event.key) != -1)) {
        this.popover.hide();
        this.onSelect(null, this.getNewValueOnEnter());
      } else if (!this.multiple) {
        if ($event.keyCode == 38 || ($event.key && $event.key == "ArrowUp")) {
          this.onArrowUp($event);
        } else if ($event.keyCode == 40 || ($event.key && $event.key == "ArrowDown")) {
          this.onArrowDown($event);
        }
      }
    }
  }

  public filterResults(newText: string, reload = true): void {
    let anyResults = 0;
    this.text = newText;
    this.options.forEach(option => {
      if (!option.text.startsWith(this.text)) {
        option.contentWrapper.nativeElement.parentElement.style.display = 'none';
      } else {
        anyResults++;
        option.contentWrapper.nativeElement.parentElement.style.display = 'flex';
      }
    });
    if (!anyResults) {
      this.popover.elementRef.nativeElement.children[0].style.display = 'none';
    } else {
      this.popover.elementRef.nativeElement.children[0].style.display = 'block';
      if (!reload) return;
      this.onSelect(null, this.getNewValueOnFilterChange());
    }
  }

  public addFocus(): void {
    this.focused = true;
  }

  public removeFocus(): void {
    this.focused = false;
  }

  private onArrowUp($event: KeyboardEvent) {
    let arr = this.options.toArray().filter(
      option => option.contentWrapper.nativeElement.parentElement.style.display !== 'none'
    );
    if (!arr.length) {
      return;
    }

    for (let i = 0; i < arr.length; i++) {
      if (arr[i].selected) {
        if (i - 1 >= 0) {
          this.onSelect($event, arr[i-1].value);
        }
        break;
      }
    }

    $event.preventDefault();
  }

  private onArrowDown($event: KeyboardEvent) {
    let arr = this.options.toArray().filter(
      option => option.contentWrapper.nativeElement.parentElement.style.display !== 'none'
    );
    if (!arr.length) {
      return;
    }

    const selectedOption = arr.find(option => option.selected);

    if(selectedOption){
      const selectedOptionIndex = arr.indexOf(selectedOption);
      if (selectedOptionIndex + 1 < arr.length) {
        this.onSelect($event, arr[selectedOptionIndex + 1].value);
      }
    }else {
      this.onSelect($event, arr[0].value);
    }
    $event.preventDefault();
  }

  private isEmpty() {
    return this.multiple ? !this.ngModel.length : !this.ngModel;
  }

  // rebind options and reset value in connected select
  public reset(resetValue: boolean = true) {
    if (resetValue && !this.isEmpty()) {
      this.ngModel = this.multiple ? [] : '';
      this.onChange(this.ngModel);
      this.change.emit(this.ngModel);
      this.renderValue(this.ngModel);
    }
  }

  private bindOptions() {
    this.options.forEach((selectOptionComponent: MdlOptionComponent) => {
      selectOptionComponent.setMultiple(this.multiple);
      selectOptionComponent.onSelect = this.onSelect.bind(this);

      if (selectOptionComponent.value != null) {
        this.textByValue[this.stringifyValue(selectOptionComponent.value)] = selectOptionComponent.text;
      }
    });
  }

  private renderValue(value: any) {
    if (this.multiple) {
      this.text = value.map((value: string) => this.textByValue[this.stringifyValue(value)]).join(', ');
    } else {
      this.text = this.textByValue[this.stringifyValue(value)]||'';
    }
    this.changeDetectionRef.detectChanges();

    if (this.options) {
      this.options.forEach((selectOptionComponent) => {
        selectOptionComponent.updateSelected(value);
      });
    }
  }

  private stringifyValue(value: any): string {
    switch (typeof value) {
      case 'number': return String(value);
      case 'object': return JSON.stringify(value);
      default: return (!!value) ? String(value) : '';
    }
  }

  public toggle($event: Event) {
    if (!this.disabled) {
      this.popover.toggle($event);
      $event.stopPropagation();
    }
    this.filterResults(this.text, false);
  }

  public open($event: Event) {
    if (!this.disabled && !this.popover.isVisible) {
      this.popover.show($event);
    }
  }

  public close() {
    if (!this.disabled && this.popover.isVisible) {
      this.popover.hide();
    }
    this.onSelect(null, this.getNewValueOnLeave());
  }

  private onSelect($event: Event, value: any) {
    if (this.multiple) {
      // prevent popup close on click inside popover when selecting multiple
      $event.stopPropagation();
    } else {
      let popover: any = this.popover.elementRef.nativeElement;
      let list: any = popover.querySelector(".mdl-list");
      let option: any = null;

      this.options.forEach(o => {
        // not great for long lists because break is not available
        if (o.value == value) {
          option = o.contentWrapper.nativeElement;
        }
      });

      if (option) {
        const selectedItemElem = option.parentElement;
        const computedScrollTop = selectedItemElem.offsetTop - (list.clientHeight / 2) + (selectedItemElem.clientHeight / 2);
        list.scrollTop =  Math.max(computedScrollTop, 0);
      }
    }
    this.writeValue(value);
    this.change.emit(this.ngModel);
  }

  public writeValue(value: any): void {
    if (this.multiple) {
      this.ngModel = this.ngModel || [];
      if (!value || this.ngModel === value) {
        // skip ngModel update when undefined value or multiple selects initialized with same array
      } else if (Array.isArray(value)) {
        this.ngModel = uniq(this.ngModel.concat(value));
      } else if (this.ngModel.map((v:any) => this.stringifyValue(v)).indexOf(this.stringifyValue(value)) != -1) {
        this.ngModel = [...this.ngModel.filter((v: any) => this.stringifyValue(v) !== this.stringifyValue(value))];
      } else if (!!value) {
        this.ngModel = [...this.ngModel, value];
      }
    } else {
      this.ngModel = value;
    }
    this.onChange(this.ngModel);
    this.renderValue(this.ngModel);
  }

  public registerOnChange(fn: (value: any) => void) {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  public getNewValueOnFilterChange(): string {
    let opt = this.options.toArray().filter(
      option => option.contentWrapper.nativeElement.parentElement.style.display !== 'none'
    );
    if (!opt.length) {
      return this.text;
    }
    return opt[0].value;
  }

  public getNewValueOnEnter(): string {
    let opt = this.options.toArray().filter(
      option => option.contentWrapper.nativeElement.parentElement.style.display !== 'none'
    );
    if (!opt.length) return this.text;
    for (let i = 0; i < opt.length; i++) {
      if (opt[i].value === this.ngModel) {
        return opt[i].value;
      }
    }
    return opt[0].value;
  }

  public getNewValueOnLeave(): string {
    let opt: Array<MdlOptionComponent> = this.options.toArray();
    for (let i = 0; i < opt.length; i++) {
      if (this.text === opt[i].text && this.ngModel === opt[i].value) {
        return opt[i].value;
      }
    }
    return this.text;
  }
}

@NgModule({
  imports: [
    CommonModule,
    MdlPopoverModule
  ],
  exports: [
    MdlAutocompleteComponent,
    MdlOptionComponent
  ],
  declarations: [
    MdlAutocompleteComponent,
    MdlOptionComponent
  ],
  providers: [
    MDL_SELECT_VALUE_ACCESSOR
  ]
})
export class MdlAutocompleteModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MdlAutocompleteModule,
      providers: []
    };
  }
}
