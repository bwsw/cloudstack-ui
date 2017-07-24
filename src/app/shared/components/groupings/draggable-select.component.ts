import { MdlPopoverComponent } from '@angular-mdl/popover';
import { MdlOptionComponent } from '@angular-mdl/select';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs/Subscription';
import { toBoolean } from '@angular-mdl/core/components/common/boolean-property';

const uniq = (array: any[]) => Array.from(new Set(array));

function randomId() {
  const S4 = () => ((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return S4() + S4();
}

const VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DraggableSelectComponent),
  multi: true
};

@Component({
  selector: 'cs-draggable-select',
  /* tslint:disable */
  host: {
    '[class.mdl-select]': 'true',
    '[class.mdl-select--floating-label]': 'isFloatingLabel',
    '[class.has-placeholder]': 'placeholder'
  },
  /* tslint:enable */
  templateUrl: './draggable-select.component.html',
  styleUrls: [
    '../../../../../node_modules/@angular-mdl/select/select.scss',
    'draggable-select.component.scss'
  ],
  encapsulation: ViewEncapsulation.None,
  providers: [VALUE_ACCESSOR]
})
export class DraggableSelectComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  @Input() ngModel: any;
  @Input() disabled = false;
  @Input('floating-label')
  get isFloatingLabel() { return this._isFloatingLabel; }
  set isFloatingLabel(value) { this._isFloatingLabel = toBoolean(value); } // tslint:disable-line
  @Input() placeholder = '';
  @Input() label = '';
  @Input() multiple = false;
  @Input() dragItems: Array<any>;
  @Output() private change: EventEmitter<any> = new EventEmitter(true);

  @ViewChild('selectInput') selectInput: ElementRef;
  @ViewChild(MdlPopoverComponent) public popoverComponent: MdlPopoverComponent;
  @ContentChildren(MdlOptionComponent)
  public optionComponents: QueryList<MdlOptionComponent>;

  @HostBinding('class.draggable-select') public selectClass = true;

  public textfieldId: string;
  public text = '';
  public focused = false;
  private textByValue: any = {};
  private onChange: any = Function.prototype;
  private onTouched: any = Function.prototype;
  private _isFloatingLabel = false;

  private onDrop: Subscription;

  constructor(
    private changeDetectionRef: ChangeDetectorRef,
    private dragulaService: DragulaService
  ) {
    this.textfieldId = `mdl-textfield-${randomId()}`;
  }

  public ngAfterViewInit() {
    this.bindOptions();
    this.renderValue(this.ngModel);
    this.optionComponents.changes.subscribe(() => {
      this.bindOptions();
      this.renderValue(this.ngModel);
    });

    this.onDrop = this.dragulaService.dropModel.subscribe(() => {
      const newModel = this.dragItems.reduce((acc, item) => {
        if (this.ngModel.includes(item)) {
          acc.push(item);
        }
        return acc;
      }, []);
      this.writeValue(newModel);
      this.change.emit(this.ngModel);
    });
  }

  public ngOnDestroy() {
    this.onDrop.unsubscribe();
  }

  @HostListener('document:keydown', ['$event'])
  public onKeydown($event: KeyboardEvent): void {
    if (!this.disabled && this.popoverComponent.isVisible) {
      const closeKeys: Array<string> = ['Escape', 'Tab', 'Enter'];
      const closeKeyCodes: Array<Number> = [13, 27, 9];
      if (
        closeKeyCodes.indexOf($event.keyCode) !== -1 ||
        ($event.key && closeKeys.indexOf($event.key) !== -1)
      ) {
        this.popoverComponent.hide();
      } else if (!this.multiple) {
        if ($event.keyCode === 38 || ($event.key && $event.key === 'ArrowUp')) {
          this.onArrowUp($event);
        } else if ($event.keyCode === 40 || ($event.key && $event.key === 'ArrowDown')) {
          this.onArrowDown($event);
        }
      }
    }
  }

  isDirty(): boolean {
    return Boolean(this.selectInput.nativeElement.value);
  }

  private onArrowUp($event: KeyboardEvent) {
    const arr = this.optionComponents.toArray();
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].selected) {
        if (i - 1 >= 0) {
          this.onSelect($event, arr[i - 1].value);
        }

        break;
      }
    }

    $event.preventDefault();
  }

  private onArrowDown($event: KeyboardEvent) {
    const arr = this.optionComponents.toArray();

    const selectedOption = arr.find(option => option.selected);

    if (selectedOption) {
      const selectedOptionIndex = arr.indexOf(selectedOption);
      if (selectedOptionIndex + 1 < arr.length) {
        this.onSelect($event, arr[selectedOptionIndex + 1].value);
      }
    } else {
      this.onSelect($event, arr[0].value);
    }

    $event.preventDefault();
  }

  public addFocus(): void {
    this.focused = true;
  }

  public removeFocus(): void {
    this.focused = false;
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
    this.optionComponents.forEach((selectOptionComponent: MdlOptionComponent) => {
      selectOptionComponent.setMultiple(this.multiple);
      selectOptionComponent.onSelect = this.onSelect.bind(this);
      this.textByValue[this.stringifyValue(selectOptionComponent.value)] =
        selectOptionComponent.text;
    });
  }

  private renderValue(value: any) {
    if (this.multiple) {
      this.text = value
        .map((val: string) => this.textByValue[this.stringifyValue(val)])
        .join(', ');
    } else {
      this.text = this.textByValue[this.stringifyValue(value)] || '';
    }
    this.changeDetectionRef.detectChanges();

    if (this.optionComponents) {
      this.optionComponents.forEach(selectOptionComponent => {
        selectOptionComponent.updateSelected(value);
      });
    }
  }

  private stringifyValue(value: any): string {
    switch (typeof value) {
      case 'number':
        return String(value);
      case 'object':
        return JSON.stringify(value);
      default:
        return !!value ? String(value) : '';
    }
  }

  public toggle($event: Event) {
    if (!this.disabled) {
      this.popoverComponent.toggle($event);
      $event.stopPropagation();
    }
  }

  public open($event: Event) {
    if (!this.disabled && !this.popoverComponent.isVisible) {
      this.popoverComponent.show($event);
    }
  }

  public close($event: Event) {
    if (!this.disabled && this.popoverComponent.isVisible) {
      this.popoverComponent.hide();
    }
  }

  private onSelect($event: Event, value: any) {
    if (this.multiple) {
      // prevent popup close on click inside popover when selecting multiple
      $event.stopPropagation();
    } else {
      const popover: any = this.popoverComponent.elementRef.nativeElement;
      const list: any = popover.querySelector('.mdl-list');
      let option: any = null;

      this.optionComponents.forEach(o => {
        // not great for long lists because break is not available
        if (o.value == value) { // tslint:disable-line
          option = o.contentWrapper.nativeElement;
        }
      });

      if (option) {
        if (option.offsetTop > popover.clientHeight) {
          list.scrollTop += option.parentElement.clientHeight;
        } else if (option.offsetTop < list.scrollTop) {
          list.scrollTop -= option.parentElement.clientHeight;
        }
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
        this.ngModel = uniq([].concat(value, this.ngModel));
      } else if (this.ngModel.indexOf(value) !== -1) {
        this.ngModel = [...this.ngModel.filter((v: string) => v !== value)];
      } else if (!!value) {
        this.ngModel = [...this.ngModel, value];
        this.ngModel = this.dragItems.reduce((acc, item) => {
          if (this.ngModel.includes(item)) {
            acc.push(item);
          }
          return acc;
        }, []);
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

  public getLabelVisibility(): string {
    return this.isFloatingLabel == null ||
    (this.isFloatingLabel != null && this.text != null && this.text.length > 0)
      ? 'block'
      : 'none';
  }
}
