import { ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { DayPeriodName } from '../../../../shared/components/day-period/day-period.component';
import { Time } from '../../../../shared/components/time-picker/time-picker.component';
import { TimeFormat } from '../../../../shared/types';

export type DailyPolicy = Time;

@Component({
  selector: 'cs-daily-policy',
  templateUrl: 'daily-policy.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DailyPolicyComponent),
      multi: true,
    },
  ],
})
export class DailyPolicyComponent implements ControlValueAccessor {
  @Input()
  public timeFormat: TimeFormat;
  // tslint:disable-next-line:variable-name
  public _time: Time;

  public periods: DayPeriodName[];

  @Input()
  public get policy(): DailyPolicy {
    return this._time;
  }

  public set policy(value) {
    this._time = value;
    this.cd.detectChanges();
    this.propagateChange(this.policy);
  }

  constructor(private cd: ChangeDetectorRef) {}

  public propagateChange: any = () => {};

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void {}

  public writeValue(value: any): void {
    if (value) {
      this.policy = value;
    }
  }
}
