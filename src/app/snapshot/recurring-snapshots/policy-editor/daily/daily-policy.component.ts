import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { DayPeriodName } from '../../day-period/day-period.component';
import { Time } from '../../time-picker/time-picker.component';


export type DailyPolicy = Time;
export type TimeFormat = 12 | 24;

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
  public _time: Time;

  public periods: Array<DayPeriodName>;

  public hoursMinValue = 0;

  constructor(private translateService: TranslateService) {}

  public get timeFormat(): TimeFormat {
    return 24; // todo
  }

  public get hoursErrorMessage(): Observable<string> {
    return this.translateService.get('BETWEEN', {
      lowerLimit: this.hoursMinValue,
      upperLimit: this.hoursMaxValue
    });
  }

  @Input()
  public get policy(): DailyPolicy {
    return this._time;
  }

  public set policy(value) {
    this._time = value;
    this.propagateChange(this.policy);
  }

  private get hoursMaxValue(): number {
    return this.timeFormat - 1;
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
