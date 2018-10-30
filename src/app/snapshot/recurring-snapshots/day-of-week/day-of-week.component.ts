import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { DayOfWeek } from '../../../shared/types';
import { State, UserTagsSelectors } from '../../../root-store';
import { select, Store } from '@ngrx/store';

export interface DayOfWeekName {
  value: DayOfWeek;
  name: string;
}

@Component({
  selector: 'cs-day-of-week',
  templateUrl: 'day-of-week.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DayOfWeekComponent),
      multi: true,
    },
  ],
})
export class DayOfWeekComponent {
  // tslint:disable-next-line:variable-name
  public _dayOfWeek: DayOfWeek;
  readonly daysOfWeek$: Observable<DayOfWeekName[]> = this.getDaysOfWeek();

  constructor(private store: Store<State>, private translateService: TranslateService) {}

  private get daysOfWeekList(): DayOfWeekName[] {
    return [
      { value: DayOfWeek.Sunday, name: 'DATE_TIME.DAYS_OF_WEEK.SUNDAY' },
      { value: DayOfWeek.Monday, name: 'DATE_TIME.DAYS_OF_WEEK.MONDAY' },
      { value: DayOfWeek.Tuesday, name: 'DATE_TIME.DAYS_OF_WEEK.TUESDAY' },
      { value: DayOfWeek.Wednesday, name: 'DATE_TIME.DAYS_OF_WEEK.WEDNESDAY' },
      { value: DayOfWeek.Thursday, name: 'DATE_TIME.DAYS_OF_WEEK.THURSDAY' },
      { value: DayOfWeek.Friday, name: 'DATE_TIME.DAYS_OF_WEEK.FRIDAY' },
      { value: DayOfWeek.Saturday, name: 'DATE_TIME.DAYS_OF_WEEK.SATURDAY' },
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

  public registerOnTouched(): void {}

  public writeValue(value: any): void {
    if (value) {
      this.dayOfWeek = value;
    }
  }

  private getDaysOfWeek(): Observable<DayOfWeekName[]> {
    const dayNames = this.daysOfWeekList.map(day => day.name);

    return forkJoin(
      this.store.pipe(
        select(UserTagsSelectors.getFirstDayOfWeek),
        first(),
      ),
      this.translateService.get(dayNames),
    ).pipe(
      map(([firstDayOfWeek, translations]) => {
        const daysOfWeek = this.daysOfWeekList;

        if (firstDayOfWeek === DayOfWeek.Monday) {
          daysOfWeek.push(daysOfWeek.shift());
        }

        return daysOfWeek.map(dayOfWeek => {
          dayOfWeek.name = translations[dayOfWeek.name];
          return dayOfWeek;
        });
      }),
    );
  }
}
