import { MdlTextFieldComponent } from '@angular-mdl/core';
import { Component, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('minuteField') public minuteField: MdlTextFieldComponent;
  public _policy: HourlyPolicy;

  public _minute = 0;
  public minValue = 0;
  public maxValue = 59;

  constructor(private translateService: TranslateService) {}

  public get errorMessage(): Observable<string> {
    return this.translateService.get('BETWEEN', {
      lowerLimit: this.minValue,
      upperLimit: this.maxValue
    });
  }

  public get minute(): string {
    return this._minute.toString();
  }

  public set minute(value: string) {
    this._minute = +value;
  }

  public updateMinute(value: number): void {
    if (value == null) {
      return;
    }

    let newValue: string;

    if (Number.isNaN(value) || value == null) {
      newValue = this.minute;
    } else {
      if (value > this.maxValue) {
        newValue = this.minValue.toString();
      } else if (value < this.minValue) {
        newValue = this.maxValue.toString();
      } else {
        newValue = value.toString();
      }
    }

    this.minute = newValue;
    this.minuteField.inputEl.nativeElement.value = this.minute;
    this.minuteField.writeValue(this.minute);
    this.writeValue(this.policy);
  }

  public propagateChange: any = () => {};

  @Input()
  public get policy(): HourlyPolicy {
    return {
      minute: +this.minute
    };
  }

  public set policy(value) {
    if (value != null) {
      this._policy = value;
      this.minute = value.minute.toString();
      this.propagateChange(this.policy);
    }
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void { }

  public writeValue(value: any): void {
    if (value != null) {
      this.policy = value;
    }
  }
}
