import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { LanguageService } from '../../../shared/services/language.service';
import { DayOfWeek } from '../../../shared/types/day-of-week';


export interface DayOfWeekName {
  value: DayOfWeek,
  name: string
}

@Component({
  selector: 'cs-day-of-week',
  templateUrl: 'day-of-week.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DayOfWeekComponent),
      multi: true
    }
  ]
})
export class DayOfWeekComponent implements OnInit {
  public _dayOfWeek: DayOfWeek;
  public daysOfWeek$: Observable<Array<DayOfWeekName>> = this.getDaysOfWeek();

  constructor(
    private languageService: LanguageService,
    private translateService: TranslateService
  ) {}

  public ngOnInit(): void {
    this.daysOfWeek$.subscribe(daysOfWeek => {
      this.dayOfWeek = daysOfWeek[0].value;
    });
  }

  private get daysOfWeekList(): Array<DayOfWeekName> {
    return [
      { value: DayOfWeek.Sunday, name: 'SUNDAY'},
      { value: DayOfWeek.Monday, name: 'MONDAY'},
      { value: DayOfWeek.Tuesday, name: 'TUESDAY'},
      { value: DayOfWeek.Wednesday, name: 'WEDNESDAY'},
      { value: DayOfWeek.Thursday, name: 'THURSDAY'},
      { value: DayOfWeek.Friday, name: 'FRIDAY'},
      { value: DayOfWeek.Saturday, name: 'SATURDAY'},
    ];
  }

  public propagateChange: any = () => {};

  @Input()
  public get dayOfWeek(): number {
    return this._dayOfWeek;
  }

  public set dayOfWeek(value) {
    this._dayOfWeek = value;
    this.propagateChange(this.dayOfWeek);
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void { }

  public writeValue(value: any): void {
    if (value) {
      this.dayOfWeek = value;
    }
  }

  private getDaysOfWeek(): Observable<Array<DayOfWeekName>> {
    const dayNames = this.daysOfWeekList.map(_ => _.name);

    return Observable.forkJoin(
      this.languageService.getFirstDayOfWeek(),
      this.translateService.get(dayNames),
    )
      .map(([firstDayOfWeek, translations]) => {
        const daysOfWeek = this.daysOfWeekList;

        if (firstDayOfWeek === DayOfWeek.Monday) {
          daysOfWeek.push(daysOfWeek.shift());
        }

        return daysOfWeek.map(dayOfWeek => {
          dayOfWeek.name = translations[dayOfWeek.name];
          return dayOfWeek;
        });
      });
  }
}
