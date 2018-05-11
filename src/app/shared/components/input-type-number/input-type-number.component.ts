import { isNumeric } from 'rxjs/util/isNumeric';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { ErrorStateMatcher } from '@angular/material';

export class PortsErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl, form: FormGroupDirective | NgForm): boolean {
    return control.invalid;
  }
}

@Component({
  selector: 'cs-input-type-number',
  templateUrl: 'input-type-number.component.html',
  styleUrls: ['input-type-number.component.scss']
})
export class InputTypeNumberComponent implements OnChanges, OnDestroy, AfterViewInit {
  @Input() control: FormControl;
  @Input() public value: any;
  @Input() public min: number;
  @Input() public max: number;
  @Input() public step = 1;
  @Input() public name: string;
  @Input() public className: string;
  @Input() public placeholder: string;
  @Input() public validators: ValidatorFn[] = [];
  @Input() public validatorMessages: { [key: string]: string } = {};
  @Output() public valueChange = new EventEmitter();
  @Output() public onBlur = new EventEmitter<Event>();
  @Output() public onFocus = new EventEmitter<Event>();
  private controlSubscription: Subscription;
  private element: any;
  @ViewChild('selector') private selector: ElementRef;
  public matcher = new PortsErrorStateMatcher();

  ngOnChanges(changes: SimpleChanges) {
    if ('control' in changes && this.control) {
      // @TODO append localValidators in present control
      this.value = this.control.value;

      if (this.controlSubscription) {
        this.controlSubscription.unsubscribe();
      }
      this.controlSubscription = this.control.valueChanges.subscribe((value) => {
        this.value = value;
      });
    } else if (!this.control) {
      if (this.controlSubscription) {
        this.controlSubscription.unsubscribe();
      }
      this.control = new FormControl(
        { value: this.value },
        Validators.compose([...this.validators, ...this.localValidators])
      );
    }

    if ('value' in changes) {
      this.control.setValue(this.value);
    }
  }

  public ngAfterViewInit() {
    this.element = this.selector.nativeElement;
  }

  public onInputChange() {
    /*
    *  Looks strange to validate here
    *  I prefer to show all validation errors
    */
    /*if (this.min && this.min > +this.element.value) {
      this.element.value = this.min;
    } else if (this.max && +this.element.value > this.max) {
      this.element.value = this.max;
    }*/

    this.value = this.element.value;
    this.control.markAsDirty();
    this.control.setValue(this.value);
    this.valueChange.emit(this.value);
  }

  public onBlurEvent(event: Event) {
    this.onBlur.emit(event);
  }

  public onFocusEvent(event: Event) {
    this.onFocus.emit(event);
  }


  public increase(event: Event) {
    this.element.value += this.step;
    this.onInputChange();
    this.prevent(event);
  }

  public decrease(event: Event) {
    this.element.value -= this.step;
    this.onInputChange();
    this.prevent(event);
  }

  public onKeyPressEvent(event: KeyboardEvent) {
    if (!this.eventKeyIsDigit(event)) {
      this.prevent(event);
    }
  }

  public onPaste(event: ClipboardEvent) {
    const value = event.clipboardData.getData('text');
    if (!isNumeric(value)) {
      this.prevent(event);
    }
    this.onInputChange();
  }

  public ngOnDestroy() {
    if (this.controlSubscription) {
      this.controlSubscription.unsubscribe();
    }
  }

  private get localValidators() {
    const localValidators = [];
    if (this.min) {
      localValidators.push(Validators.min(this.min));
    }
    if (this.max) {
      localValidators.push(Validators.max(this.max));
    }
    return localValidators;
  }

  private eventKeyIsDigit(event) {
    const keyCode = (event.which) ? event.which : event.keyCode;
    const stringCode = String.fromCharCode(keyCode);
    return /^\d$/.test(stringCode) || ['-', '.'].indexOf(stringCode) > -1;
  }

  private prevent(event) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }
}

