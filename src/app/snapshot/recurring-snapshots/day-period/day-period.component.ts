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
  styleUrls: ['day-period.component.scss'],
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
  public periods$: Observable<Array<DayPeriodName>> = this.getPeriods();

  constructor(private translateService: TranslateService) {}

  public ngOnInit(): void {
    this.periods$.subscribe(periods => this.period = periods[0].value);
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

  private getPeriods(): Observable<Array<DayPeriodName>> {
    const periods = [
      { value: DayPeriod.Am, name: 'DATE_TIME.AM' },
      { value: DayPeriod.Pm, name: 'DATE_TIME.PM' }
    ];

    const periodNames = periods.map(_ => _.name);

    return this.translateService.get(periodNames)
      .map(lang => {
        const translations = lang.translations || lang;

        return periods.map(period => {
          period.name = translations[period.name];
          return period;
        });
      });
  }
}
