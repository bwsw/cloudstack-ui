import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as isEqual from 'lodash/isEqual';
import * as range from 'lodash/range';

import { Time } from '../../../../shared/components/time-picker/time-picker.component';
import { TimeFormat } from '../../../../shared/types';

export interface MonthlyPolicy extends Time {
  dayOfMonth: number;
}

@Component({
  selector: 'cs-monthly-policy',
  templateUrl: 'monthly-policy.component.html',
  styleUrls: ['monthly-policy.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MonthlyPolicyComponent),
      multi: true,
    },
  ],
})
export class MonthlyPolicyComponent implements ControlValueAccessor {
  @Input()
  public timeFormat: TimeFormat;
  public time: Time;
  public dayOfMonth = 1;
  public daysOfMonth: number[] = range(1, 29);

  public updateTime(value: Time): void {
    if (!isEqual(this.time, value)) {
      this.time = value;
      this.writeValue(this.policy);
    }
  }

  public updateDayOfMonth(value: number): void {
    this.dayOfMonth = value;
    this.writeValue(this.policy);
  }

  public propagateChange: any = () => {};

  @Input()
  public get policy(): MonthlyPolicy {
    return { ...this.time, dayOfMonth: this.dayOfMonth };
  }

  public set policy(value: MonthlyPolicy) {
    this.time = {
      hour: value.hour,
      minute: value.minute,
      period: value.period,
    };
    if (value.dayOfMonth) {
      this.dayOfMonth = value.dayOfMonth;
    }

    this.propagateChange(this.policy);
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void {}

  public writeValue(value: any): void {
    if (value != null) {
      this.policy = value;
    }
  }
}
