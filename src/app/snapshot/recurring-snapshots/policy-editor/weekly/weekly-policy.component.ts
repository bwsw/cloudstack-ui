import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DayOfWeek } from '../../../../shared/types/day-of-week';
import { Time } from '../../time-picker/time-picker.component';
import isEqual = require('lodash/isEqual');


export interface WeeklyPolicy extends Time {
  dayOfWeek: DayOfWeek;
}

@Component({
  selector: 'cs-weekly-policy',
  templateUrl: 'weekly-policy.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WeeklyPolicyComponent),
      multi: true
    }
  ]
})
export class WeeklyPolicyComponent implements ControlValueAccessor {
  public time: Time;
  public dayOfWeek: DayOfWeek;

  public updateTime(value: Time): void {
    if (!isEqual(value, this.time)) { // todo
      this.time = value;
      this.writeValue(this.policy);
    }
  }

  public updateDayOfWeek(value: DayOfWeek): void {
    this.dayOfWeek = value;
    this.writeValue(this.policy);
  }

  public propagateChange: any = () => {};

  @Input()
  public get policy(): WeeklyPolicy {
    return { ...this.time, dayOfWeek: this.dayOfWeek };
  }

  public set policy(value: WeeklyPolicy) {
    this.time = {
      hour: value.hour,
      minute: value.minute,
      period: value.period
    };
    this.dayOfWeek = value.dayOfWeek;
    this.propagateChange(this.policy);
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void { }

  public writeValue(value: any): void {
    if (value) {
      this.policy = value;
    }
  }
}
