import { Component, forwardRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatInput } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

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
      multi: true,
    },
  ],
})
export class HourlyPolicyComponent implements ControlValueAccessor {
  @ViewChild(MatInput)
  public minuteField: MatInput;
  // tslint:disable-next-line:variable-name
  public _policy: HourlyPolicy;

  // tslint:disable-next-line:variable-name
  public _minute = 0;
  public minValue = 0;
  public maxValue = 59;

  constructor(private translateService: TranslateService) {}

  public get errorMessage(): Observable<string> {
    return this.translateService.get('SERVICE_OFFERING.CUSTOM_SERVICE_OFFERING.BETWEEN', {
      lowerLimit: this.minValue,
      upperLimit: this.maxValue,
    });
  }

  public get minute(): string {
    return this._minute.toString();
  }

  public set minute(value: string) {
    this._minute = +value;
  }

  public updateMinute(value: number): void {
    this.minute = value.toString();
    this.minuteField.value = this.minute;
    this.writeValue(this.policy);
  }

  public propagateChange: any = () => {};

  @Input()
  public get policy(): HourlyPolicy {
    return {
      minute: +this.minute,
    };
  }

  public set policy(value) {
    if (value != null) {
      this._policy = value;
      this.minute = value.minute.toString();
      this.propagateChange(this.policy);
    }
    this.minuteField.focus();
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void {}

  public writeValue(value: any): void {
    if (value != null) {
      this.policy = value;
    }
  }
}
