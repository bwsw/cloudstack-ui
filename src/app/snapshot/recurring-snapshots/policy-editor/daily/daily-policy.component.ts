import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DayPeriodName } from '../../day-period/day-period.component';
import { Time } from '../../time-picker/time-picker.component';
import { TimeFormat } from '../../../../shared/services';


export type DailyPolicy = Time;

@Component({
  selector: 'cs-daily-policy',
  templateUrl: 'daily-policy.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DailyPolicyComponent),
      multi: true
    }
  ]
})
export class DailyPolicyComponent implements ControlValueAccessor {
  @Input() public timeFormat: TimeFormat;
  public _time: Time;

  public periods: Array<DayPeriodName>;

  @Input()
  public get policy(): DailyPolicy {
    return this._time;
  }

  public set policy(value) {
    this._time = value;
    this.propagateChange(this.policy);
  }

  public propagateChange: any = () => {};

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
