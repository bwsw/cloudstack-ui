import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';


export const enum DayPeriod {
  Am,
  Pm
}

export interface DayPeriodName {
  value: DayPeriod,
  name: string;
}

@Component({
  selector: 'cs-day-period',
  templateUrl: 'day-period.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DayPeriodComponent),
      multi: true
    }
  ]
})
export class DayPeriodComponent implements ControlValueAccessor, OnInit {
  public _period: DayPeriod;
  public periods: Array<DayPeriodName>;

  constructor(private translateService: TranslateService) {}

  public ngOnInit(): void {
    this.loadDayPeriods();
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

  public registerOnTouched(): void { }

  public writeValue(value: any): void {
    if (value) {
      this.period = value;
    }
  }

  private loadDayPeriods(): void {
    const periods = [
      { value: DayPeriod.Am, name: 'AM' },
      { value: DayPeriod.Pm, name: 'PM' }
    ];

    const periodNames = periods.map(_ => _.name);

    this.translateService.get(periodNames)
      .subscribe(lang => {
        const translations = lang.translations || lang;

        this.periods = periods.map(_ => {
          _.name = translations[_.name];
          return _;
        });

        this.period = this.periods[0].value;
      });
  }
}
