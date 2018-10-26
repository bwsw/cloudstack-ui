import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { onErrorResumeNext } from 'rxjs/operators';

import { DatePickerDialogComponent } from './date-picker-dialog.component';
import { dateTimeFormat as DateTimeFormat, formatIso } from './dateUtils';
import { Language } from '../../types';

interface DatePickerConfig {
  okLabel?: string;
  cancelLabel?: string;
  date?: Date;
  dateTimeFormat?: Function;
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
      multi: true,
    },
  ],
})
export class DatePickerComponent implements ControlValueAccessor, OnChanges {
  @Input()
  public label = '';
  @Input()
  public okLabel = 'Ok';
  @Input()
  public cancelLabel = 'Cancel';
  @Input()
  public firstDayOfWeek = 1;
  @Input()
  public dateTimeFormat = DateTimeFormat;
  @Input()
  public locale = Language.en;
  @Output()
  public changed = new EventEmitter();

  public displayDate: string;

  // tslint:disable-next-line:variable-name
  public _date: Date = new Date();
  private isDialogOpen = false;

  constructor(private dialog: MatDialog) {}

  public ngOnChanges(changes: SimpleChanges): void {
    const dateTimeFormatChange = changes['dateTimeFormat'];
    if (dateTimeFormatChange) {
      this.displayDate = this.formatDate();
    }
  }

  public propagateChange: any = () => {};

  @Input()
  public get date(): Date {
    return this._date;
  }

  public set date(newDate) {
    this._date = new Date(newDate);
    this.displayDate = this.formatDate();

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

  public registerOnTouched(): void {}

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
      dateTimeFormat: this.dateTimeFormat,
      locale: this.locale,
    };
    this.dialog
      .open(DatePickerDialogComponent, {
        panelClass: 'date-picker-dialog',
        data: { datePickerConfig: config },
      })
      .afterClosed()
      .pipe(onErrorResumeNext())
      .subscribe((date: Date) => {
        this.isDialogOpen = false;
        if (date) {
          this.date = date;
          this.changed.emit(date);
        }
      });
  }

  private formatDate(): string {
    if (this.locale) {
      return new this.dateTimeFormat(this.locale, {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      }).format(this.date);
    }
    return formatIso(this.date);
  }
}
