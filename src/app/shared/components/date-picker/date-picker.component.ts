import {
  Component,
  forwardRef,
  Input,
  AfterViewInit
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MdlDialogService } from 'angular2-mdl';

import { DatePickerDialogComponent } from './date-picker-dialog.component';
import { dateTimeFormat as DateTimeFormat, formatIso } from './dateUtils';


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
export class DatePickerComponent implements ControlValueAccessor, AfterViewInit {
  @Input() public okLabel = 'Ok';
  @Input() public cancelLabel = 'Cancel';
  @Input() public firstDayOfWeek = 1;
  @Input() public DateTimeFormat = DateTimeFormat;
  @Input() public locale = 'en';

  public displayDate: string;

  public _date: Date = new Date();
  private isDialogOpen = false;

  constructor(private dialogService: MdlDialogService) {}

  public ngAfterViewInit(): void {
    this.date = new Date();
  }

  public propagateChange: any = () => {};

  @Input()
  public get date(): Date {
    return this._date;
  }

  public set date(newDate) {
    this._date = newDate;

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
