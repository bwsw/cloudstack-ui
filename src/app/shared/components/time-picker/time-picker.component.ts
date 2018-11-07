import { Component, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatInput } from '@angular/material';
import { Utils } from '../../services/utils/utils.service';

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
  @Input()
  public disabled: boolean;
  @Input()
  public outputFormat: TimeFormat;
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

  public updateHour(hour: number): void {
    this.writeValue({
      ...this.time,
      hour,
    });
  }

  public updateMinute(minute: number): void {
    this.writeValue({
      ...this.time,
      minute,
    });
  }

  public updatePeriod(period: DayPeriod): void {
    this.writeValue({
      ...this.time,
      period,
    });
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
    const hour = value.hour || this.minHourValue;
    const minute = value.minute || this.minMinuteValue;
    const period = value.period;

    this.hour = String(hour);
    this.minute = String(minute);
    this.period = period;
    this.hourField.value = this.hour;
    this.minuteField.value = this.minute;

    this.propagateChange(this.outputFormatTime(this.time));
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void {}

  public writeValue(value: any): void {
    if (value != null && value.hour != null && value.minute != null) {
      const time = this.inputFormatTime(value);

      if (
        this.time.hour !== time.hour ||
        this.time.minute !== time.minute ||
        this.time.period !== time.period
      ) {
        this.time = time;
      }
    }
  }

  private formatTime(time: Time, format: TimeFormat): Time {
    if (format === TimeFormat.hour12) {
      return Utils.convert24ToAmPm(time);
    }

    return Utils.convertAmPmTo24(time);
  }

  private inputFormatTime(time: Time): Time {
    return this.formatTime(time, this.timeFormat);
  }

  private outputFormatTime(time: Time): Time {
    return this.formatTime(time, this.outputFormat || this.timeFormat);
  }
}
