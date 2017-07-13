import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';


export interface HourlyPolicy {
  minute: number;
}

@Component({
  selector: 'cs-hourly-policy',
  templateUrl: 'hourly-policy.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HourlyPolicyComponent),
      multi: true
    }
  ]
})
export class HourlyPolicyComponent implements ControlValueAccessor {
  public minute: number;
  public _policy: HourlyPolicy;

  public minValue = 0;
  public maxValue = 59;

  constructor(private translateService: TranslateService) {}

  public get errorMessage(): Observable<string> {
    return this.translateService.get('BETWEEN', {
      lowerLimit: this.minValue,
      upperLimit: this.maxValue
    });
  }

  public propagateChange: any = () => {};

  @Input()
  public get policy(): HourlyPolicy {
    return {
      minute: this.minute
    };
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
