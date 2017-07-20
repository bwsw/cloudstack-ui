import { MdlTextFieldComponent } from '@angular-mdl/core';
import { Component, forwardRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DayPeriod } from '../day-period/day-period.component';
import { TimeFormat } from '../policy-editor/daily/daily-policy.component';
import throttle = require('lodash/throttle');
import { SnapshotPolicyService } from '../snapshot-policy.service';


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
      multi: true
    }
  ]
})
export class TimePickerComponent implements ControlValueAccessor {
  @ViewChild('hourField') public hourField: MdlTextFieldComponent;
  @ViewChild('minuteField') public minuteField: MdlTextFieldComponent;

  public _hour = 1;
  public _minute = 0;
  public period = DayPeriod.Am;

  public minMinuteValue = 0;
  public maxMinuteValue = 59;
  public minHourValue = 1;

  public timeFormat: TimeFormat = 12;

  public get hour(): string {
    return this._hour.toString();
  }

  public set hour(value: string) {
    this._hour = +value;
  }

  public get minute(): string {
    return this.pad(this._minute.toString());
  }

  public set minute(value: string) {
    this._minute = +value;
  }

  public get maxHourValue(): number {
    return this.timeFormat;
  }

  public updateHour(value: number): void {
    let newValue: string;

    if (Number.isNaN(value) || value == null) {
      newValue = this.hour;
    } else {
      if (value === this.maxHourValue + 1) {
        newValue = this.minHourValue.toString();
      } else if (value > this.maxHourValue) {
        newValue = value.toString().substr(-1);
      } else if (value < this.minHourValue) {
        newValue = this.maxHourValue.toString();
      } else {
        newValue = value.toString();
      }
    }

    this.hour = newValue;
    this.hourField.inputEl.nativeElement.value = this.hour;
    this.hourField.writeValue(this.hour);
    this.writeValue(this.time);
  }

  public updateMinute(value: number): void {
    let newValue: string;

    if (Number.isNaN(value) || value == null) {
      newValue = this.minute;
    } else {
      if (value > this.maxMinuteValue) {
        newValue = this.pad(this.minMinuteValue);
      } else if (value < this.minMinuteValue) {
        newValue = this.pad(this.maxMinuteValue);
      } else {
        newValue = this.pad(value);
      }
    }

    this.minute = newValue;
    this.minuteField.inputEl.nativeElement.value = this.minute;
    this.minuteField.writeValue(this.minute);
    this.writeValue(this.time);
  }

  public updatePeriod(value: DayPeriod): void {
    this.period = value;
    this.writeValue(this.time);
  }

  public propagateChange: any = () => {};

  @Input()
  public get time(): Time {
    return {
      hour: +this.hour,
      minute: +this.minute,
      period: this.period
    }
  }

  public set time(value: Time) {
    this.hour = value.hour.toString();
    this.minute = value.minute.toString();
    this.period = value.period;
    this.propagateChange(this.time);
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void { }

  public writeValue(value: any): void {
    if (value) {
      this.time = value;
    }
  }

  private pad(value: any): string {
    return +value < 10 ? `0${+value}` : `${+value}`;
  }
}
