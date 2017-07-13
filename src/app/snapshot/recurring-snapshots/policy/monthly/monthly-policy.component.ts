import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import range = require('lodash/range');


export interface MonthlyPolicy {
  dayOfMonth: number;
}

@Component({
  selector: 'cs-monthly-policy',
  templateUrl: 'monthly-policy.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MonthlyPolicyComponent),
      multi: true
    }
  ]
})
export class MonthlyPolicyComponent implements ControlValueAccessor {
  public _policy: MonthlyPolicy;

  public dayOfMonth = 1;
  public daysOfMonth: Array<number> = range(1, 29);

  constructor(private translateService: TranslateService) {}

  public get errorMessage(): Observable<string> {
    return this.translateService.get('BETWEEN', {
      lowerLimit: 0,
      upperLimit: 59
    });
  }

  public propagateChange: any = () => {};

  @Input()
  public get policy(): MonthlyPolicy {
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
