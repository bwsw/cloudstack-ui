import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { TimeFormat } from '../../../../shared/services';
import { Time } from '../../time-picker/time-picker.component';
import isEqual = require('lodash/isEqual');
import range = require('lodash/range');


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
      multi: true
    }
  ]
})
export class MonthlyPolicyComponent implements ControlValueAccessor {
  @Input() public timeFormat: TimeFormat;
  public time: Time;
  public dayOfMonth = 1;
  public daysOfMonth: Array<number> = range(1, 29);

  constructor(private translateService: TranslateService) {}

  public get errorMessage(): Observable<string> {
    return this.translateService.get('BETWEEN', {
      lowerLimit: 0,
      upperLimit: 59
    });
  }

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
      period: value.period
    };
    this.dayOfMonth = value.dayOfMonth;
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
