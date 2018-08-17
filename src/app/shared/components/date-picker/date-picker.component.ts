import { Component, EventEmitter, forwardRef, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { DatePickerDialogComponent } from './date-picker-dialog.component';
import { dateTimeFormat as DateTimeFormat, formatIso } from './dateUtils';
import { Language } from '../../types';


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
  styleUrls: ['date-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true
    }
  ]
})
export class DatePickerComponent implements ControlValueAccessor, OnChanges {
  @Input() public okLabel = 'Ok';
  @Input() public cancelLabel = 'Cancel';
  @Input() public firstDayOfWeek = 1;
  @Input() public DateTimeFormat = DateTimeFormat;
  @Input() public locale = Language.en;
  @Output() public change = new EventEmitter();

  public displayDate: string;

  public _date: Date = new Date();
  private isDialogOpen = false;

  constructor(
    private dialog: MatDialog
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    const DateTimeFormatChange = changes['DateTimeFormat'];
    if (DateTimeFormatChange) {
      this.displayDate = this._formatDate();
    }
  }

  public propagateChange: any = () => {};

  @Input()
  public get date(): Date {
    return this._date;
  }

  public set date(newDate) {
    this._date = new Date(newDate);
    this.displayDate = this._formatDate();

    this.propagateChange(this.date);
  }

  public writeValue(value): void {
    if (value) {
      this.date = value;
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
    this.dialog.open(DatePickerDialogComponent, {
      panelClass: 'date-picker-dialog',
      data: { datePickerConfig: config }
    })
      .afterClosed()
      .onErrorResumeNext()
      .subscribe((date: Date) => {
        this.isDialogOpen = false;
        if (date) {
          this.date = date;
          this.change.emit(date);
        }
      });
  }

  private _formatDate(): string {
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
