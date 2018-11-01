import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const enum DayPeriod {
  Am,
  Pm,
}

export interface DayPeriodName {
  value: DayPeriod;
  name: string;
}

@Component({
  selector: 'cs-day-period',
  templateUrl: 'day-period.component.html',
  styleUrls: ['day-period.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DayPeriodComponent),
      multi: true,
    },
  ],
})
export class DayPeriodComponent implements ControlValueAccessor, OnInit {
  // tslint:disable-next-line:variable-name
  public _period: DayPeriod;
  public periods: DayPeriodName[] = [
    { value: DayPeriod.Am, name: 'DATE_TIME.AM' },
    { value: DayPeriod.Pm, name: 'DATE_TIME.PM' },
  ];

  public ngOnInit(): void {
    this.period = this.periods[0].value;
  }

  public propagateChange: any = () => {};

  @Input()
  public get period(): number {
    return this._period;
  }

  public set period(value) {
    this._period = value;
    this.propagateChange(this.period);
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void {}

  public writeValue(value: any): void {
    if (value) {
      this.period = value;
    }
  }
}
