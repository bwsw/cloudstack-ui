import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DayOfWeek } from '../../../../shared/types/day-of-week';
import { TimePolicy } from '../policy.component';


export class WeeklyPolicy {
  public dayOfWeek: DayOfWeek;
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
  public _policy: TimePolicy;

  public dayOfWeek: DayOfWeek;

  public propagateChange: any = () => {};

  @Input()
  public get policy(): TimePolicy {
    return this._policy;
  }

  public set policy(value) {
    this._policy = value;
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
