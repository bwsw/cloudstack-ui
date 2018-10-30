import { Component, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatInput } from '@angular/material';

import { padStart } from '../../utils/pad-start';
import { DayPeriod } from '../day-period/day-period.component';
import { TimeFormat } from '../../types/index';

export interface Time {
  hour: number;
  minute: number;
  period?: DayPeriod;
}

@Component({
  selector: 'cs-time-picker',
  templateUrl: 'time-picker.component.html',
  styleUrls: ['time-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimePickerComponent),
      multi: true,
    },
  ],
})
export class TimePickerComponent implements ControlValueAccessor, OnInit {
  @Input()
  public label = '';
  @Input()
  public timeFormat: TimeFormat;
  @ViewChild('hourField')
  public hourField: MatInput;
  @ViewChild('minuteField')
  public minuteField: MatInput;

  // tslint:disable-next-line:variable-name
  public _hour: number;
  // tslint:disable-next-line:variable-name
  public _minute: number;
  public period: DayPeriod;

  public minMinuteValue = 0;
  public maxMinuteValue = 59;

  public ngOnInit(): void {
    this._hour = this.minHourValue;
    this._minute = this.minMinuteValue;

    if (this.timeFormat === TimeFormat.hour12) {
      this.period = DayPeriod.Am;
    }
  }

  public get showPeriodSelector(): boolean {
    return this.timeFormat === TimeFormat.hour12;
  }

  public get hour(): string {
    return this._hour && this._hour.toString();
  }

  public set hour(value: string) {
    this._hour = +value;
  }

  public get minute(): string {
    return padStart(this._minute.toString(), 2);
  }

  public set minute(value: string) {
    this._minute = +value;
  }

  public get minHourValue(): number {
    if (this.timeFormat === TimeFormat.hour12) {
      return 1;
    }
    return 0;
  }

  public get maxHourValue(): number {
    if (this.timeFormat === TimeFormat.hour12) {
      return 12;
    }
    return 23;
  }

  public updateHour(value: number): void {
    this.hour = value.toString();
    this.hourField.value = this.hour;
    this.writeValue(this.time);
  }

  public updateMinute(value: number): void {
    this.minute = value.toString();
    this.minuteField.value = this.minute;
    this.writeValue(this.time);
  }

  public updatePeriod(value: DayPeriod): void {
    this.period = value;
    this.writeValue(this.time);
  }

  public propagateChange: any = () => {};

  public get time(): Time {
    return {
      hour: +this.hour,
      minute: +this.minute,
      period: this.period,
    };
  }

  @Input()
  public set time(value: Time) {
    this.hour = (value.hour || this.minHourValue).toString();
    this.minute = (value.minute || this.minMinuteValue).toString();
    if (value.period) {
      this.period = value.period;
    }

    this.propagateChange(this.time);
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void {}

  public writeValue(value: any): void {
    // todo: remove ngModel
    if (value != null && value.hour != null && value.minute != null) {
      this.time = value;
    }
  }
}
