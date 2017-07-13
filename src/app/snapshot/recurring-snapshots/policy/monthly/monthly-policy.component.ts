import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';


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
  public _minutes: number;

  constructor(private translateService: TranslateService) {}

  public get errorMessage(): Observable<string> {
    return this.translateService.get('BETWEEN', {
      lowerLimit: 0,
      upperLimit: 59
    });
  }

  public propagateChange: any = () => {};

  @Input()
  public get minutes(): number {
    return this._minutes;
  }

  public set minutes(value) {
    this._minutes = value;
    this.propagateChange(this.minutes);
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void { }

  public writeValue(value: any): void {
    if (value) {
      this.minutes = value;
    }
  }
}
