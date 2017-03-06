import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MdlDialogService } from 'angular2-mdl';

import { DatePickerDialogComponent } from './date-picker-dialog.component';
import {
  dateTimeFormat as DateTimeFormat,
  formatIso
} from './dateUtils';


interface DatePickerConfig {
  okLabel?: string;
  cancelLabel?: string;
  date?: Date;
  DateTimeFormat?: Function;
  firstDayOfWeek?: number;
  locale?: string;
}

@Component({
  selector: 'cs-date-picker',
  templateUrl: 'date-picker.component.html',
  styles: [':host /deep/ mdl-textfield { width: 150px; }'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true
    }
  ]
})
export class DatePickerComponent implements ControlValueAccessor {
  @Input() public okLabel = 'Ok';
  @Input() public cancelLabel = 'Cancel';
  @Input() public firstDayOfWeek = 1;
  @Input() public formatDate: Function;
  @Input() public DateTimeFormat = DateTimeFormat;
  @Input() public locale = 'en';

  public _displayDate: string;

  public date: Date = new Date();
  private isDialogOpen = false;

  constructor(private dialogService: MdlDialogService) {
    this.displayDate = this._formatDate();
  }

  public propagateChange: any = () => {};

  @Input()
  public get displayDate(): string {
    return this._displayDate;
  }

  public set displayDate(newDate) {
    this._displayDate = newDate;

    this.propagateChange(this.displayDate);
  }

  public writeValue(value): void {
    if (value) {
      this.displayDate = value;
    } else {
      this.displayDate = this._formatDate();
    }
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void { }

  public onFocus(e: Event): void {
    if (this.isDialogOpen) {
      return;
    }
    (e.target as HTMLInputElement).blur();

    this.isDialogOpen = true;

    const config: DatePickerConfig = {
      date: this.date,
      okLabel: this.okLabel,
      cancelLabel: this.cancelLabel,
      firstDayOfWeek: this.firstDayOfWeek,
      DateTimeFormat: this.DateTimeFormat,
      locale: this.locale
    };
    this.dialogService.showCustomDialog({
      component: DatePickerDialogComponent,
      classes: 'date-picker-dialog',
      providers: [
        { provide: 'datePickerConfig', useValue: config }
      ]
    })
      .switchMap(res => res.onHide())
      .onErrorResumeNext()
      .subscribe((date: Date) => {
        this.isDialogOpen = false;
        if (date) {
          this.date = date;
          this.displayDate = this._formatDate();
        }
      });
  }

  private _formatDate(): string {
    if (this.formatDate) {
      return this.formatDate(this.date);
    }
    if (this.locale) {
      return new this.DateTimeFormat(this.locale, {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      }).format(this.date);
    } else {
      return formatIso(this.date);
    }
  }
}
