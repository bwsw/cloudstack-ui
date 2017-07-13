import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { DayPeriod, DayPeriodName } from '../../day-period/day-period.component';


export interface DailyPolicy {
  hour: number;
  minute: number;
  second: number;
  period: DayPeriod;
}

export type TimeFormat = 12 | 24;

@Component({
  selector: 'cs-daily-policy',
  templateUrl: 'daily-policy.component.html',
  styleUrls: ['daily-policy.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DailyPolicyComponent),
      multi: true
    }
  ]
})
export class DailyPolicyComponent implements ControlValueAccessor {
  public hour: number;
  public minute: number;
  public second: number;
  public period: DayPeriod;

  public periods: Array<DayPeriodName>;

  public _policy: DailyPolicy;

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
    return {
      hour: this.hour,
      minute: this.minute,
      second: this.second,
      period: this.period
    };
  }

  public set policy(value) {
    this._policy = value;
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
