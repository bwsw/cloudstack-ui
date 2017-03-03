import {
  Component,
  ChangeDetectorRef,
  EventEmitter,
  forwardRef,
  Input,
  ModuleWithProviders,
  NgModule,
  Output,
  ViewChild,
  ViewEncapsulation,
  HostListener, QueryList, ViewChildren
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MdlOptionComponent } from '@angular2-mdl-ext/select';
import { MdlPopoverComponent, MdlPopoverModule } from '@angular2-mdl-ext/popover';

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
  @Input() public ngModel: any;
  @Input() public disabled: boolean = false;
  @Input() public label: string = '';
  @Input('floating-label')
  @Input() public placeholder: string = '';
  @Input() options: Array<string> = [];
  @Output() private change: EventEmitter<any> = new EventEmitter(true);
  @ViewChild(MdlPopoverComponent) public popover: MdlPopoverComponent;
  @ViewChildren(MdlOptionComponent) public optionComponents: QueryList<MdlOptionComponent>;

  public visibleOptions: Array<string>;
  private _isFloatingLabel: boolean = false;
  private textFieldId: string;
  private text: string = '';
  private onChange: any = Function.prototype;
  private onTouched: any = Function.prototype;
  private focused: boolean = false;

  constructor(private changeDetectionRef: ChangeDetectorRef) {
    this.textFieldId = `mdl-textfield-${randomId()}`;
  }

  public ngOnInit() {
    this.popover.hide = () => {
      this.popoverVisible = false;
      this.onSelect(this.getNewValueOnLeave());
      for (let i = 0; i < this.visibleOptions.length; i++) {
        if (this.ngModel === this.visibleOptions[i]) {
          this.text = this.visibleOptions[i];
          return;
        }
      }
      this.text = this.ngModel;
    };
  }

  public ngAfterViewInit() {
    this.renderValue();
  }

  public ngOnChanges(): void {
    this.renderValue();
  }

  public get isFloatingLabel() {
    return this._isFloatingLabel;
  }

  public set isFloatingLabel(value) {
    this._isFloatingLabel = toBoolean(value);
  }

  @HostListener('document:keydown', ['$event'])
  public onKeyDown($event: KeyboardEvent): void {
    if (!this.disabled && this.popover.isVisible) {
      let closeKeys: Array<string> = ["Escape", "Tab", "Enter"];
      let closeKeyCodes: Array<Number> = [13, 27, 9];
      if (closeKeyCodes.indexOf($event.keyCode) != -1 || ($event.key && closeKeys.indexOf($event.key) != -1)) {
        this.popover.hide();
        this.onSelect(this.getNewValueOnEnter());
      } else {
        if ($event.keyCode == 38 || ($event.key && $event.key == "ArrowUp")) {
          this.onArrowUp($event);
        } else if ($event.keyCode == 40 || ($event.key && $event.key == "ArrowDown")) {
          this.onArrowDown($event);
        }
      }
    }
  }

  public filterResults(newText: string, reload = true): void {
    this.text = newText;

    this.visibleOptions = this.options.filter(option => option.startsWith(this.text || ''));

    if (!this.visibleOptions.length) {
      this.popoverVisible = false;
      return;
    }
    this.popoverVisible = true;
    if (!reload) { return; }
    this.onSelect(this.getNewValueOnFilterChange());
  }

  private set popoverVisible(visible: boolean) {
    let style = this.popover.elementRef.nativeElement.style;
    if (visible) {
      style.display = 'block';
    } else {
      style.display = 'none';
    }
  }

  public addFocus(): void {
    this.focused = true;
  }

  public removeFocus(): void {
    this.focused = false;
  }

  private onArrowUp($event: KeyboardEvent) {
    if (!this.visibleOptions.length) {
      return;
    }

    const selectedOptionIndex = this.visibleOptions.findIndex(option => option === this.ngModel);

    if (selectedOptionIndex !== -1 && selectedOptionIndex) {
      this.onSelect(this.visibleOptions[selectedOptionIndex - 1]);
    } else {
      this.onSelect(this.visibleOptions[this.visibleOptions.length - 1]);
    }

    $event.preventDefault();
  }

  private onArrowDown($event: KeyboardEvent) {
    if (!this.visibleOptions.length) {
      return;
    }

    const selectedOptionIndex = this.visibleOptions.findIndex(option => option === this.ngModel);

    if (selectedOptionIndex !== -1 && selectedOptionIndex + 1 < this.visibleOptions.length) {
      this.onSelect(this.visibleOptions[selectedOptionIndex + 1]);
    } else {
      this.onSelect(this.visibleOptions[0]);
    }
    $event.preventDefault();
  }

  public reset(resetValue: boolean = true) {
    if (resetValue && this.ngModel) {
      this.ngModel = '';
      this.onChange(this.ngModel);
      this.change.emit(this.ngModel);
      this.renderValue();
    }
  }

  private renderValue() {
    this.text = this.ngModel;
    this.changeDetectionRef.detectChanges();
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
    this.onSelect(this.getNewValueOnLeave());
  }

  private onSelect(value: any) {
    let popover: any = this.popover.elementRef.nativeElement;
    let list: any = popover.querySelector(".mdl-list");
    let option: any = null;

    this.optionComponents.forEach(o => {
      if (o.value == value) {
        option = o.contentWrapper.nativeElement;
      }
    });

    if (option) {
      const selectedItemElem = option.parentElement;
      const computedScrollTop =
        selectedItemElem.offsetTop - (list.clientHeight / 2) + (selectedItemElem.clientHeight / 2);
      list.scrollTop =  Math.max(computedScrollTop, 0);
    }

    this.writeValue(value);
    this.change.emit(this.ngModel);

    if (this.optionComponents) {
      this.optionComponents.forEach(optionComponent => {
        optionComponent.updateSelected(value);
      });
    }
  }

  public writeValue(value: any): void {
    this.ngModel = value;
    this.onChange(this.ngModel);
    this.renderValue();
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
    if (!this.visibleOptions.length) {
      return this.text;
    }
    return this.visibleOptions[0];
  }

  public getNewValueOnEnter(): string {
    if (!this.visibleOptions.length) {
      return this.text;
    }
    for (let i = 0; i < this.visibleOptions.length; i++) {
      if (this.visibleOptions[i] === this.ngModel) {
        return this.visibleOptions[i];
      }
    }
    return this.visibleOptions[0];
  }

  public getNewValueOnLeave(): string {
    // let opt: Array<MdlOptionComponent> = this.options.toArray();
    for (let i = 0; i < this.visibleOptions.length; i++) {
      if (this.text === this.visibleOptions[i] && this.ngModel === this.visibleOptions[i]) {
        return this.visibleOptions[i];
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
