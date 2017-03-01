import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, } from '@angular/core';

import {
  getWeekArray,
  isEqualDate,
  dateTimeFormat as DateTimeFormat, getFirstDayOfMonth
} from './dateUtils';


@Component({
  selector: 'cs-calendar-month',
  templateUrl: 'calendar-month.component.html',
  styleUrls: ['calendar-month.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarMonthComponent {
  @Input() locale: string;
  @Input() displayDate: Date;
  @Input() selectedDate: Date;

  @Output() dateSelected = new EventEmitter<Date>();

  public get weekElements(): Array<Array<Date>> {
    console.log('weekElements');
    return getWeekArray(this.displayDate, 0);
  }

  public getDay(date): string|null {
    if (!date) {
      return null;
    }
    return new DateTimeFormat(this.locale, {
      day: 'numeric',
    }).format(date);
  }

  public isSameDate(date): boolean {
    return isEqualDate(this.selectedDate, date);
  }

  public setSelectedDate(_e: Event, day: Date): void {
    const newDisplayDate = getFirstDayOfMonth(day);
    if (newDisplayDate !== this.displayDate) {
      this.setDisplayDate(newDisplayDate, day);
    }
  }

  private setDisplayDate(date, newSelectedDate): void {
    const newDisplayDate = getFirstDayOfMonth(date);

    if (newDisplayDate !== this.displayDate) {
      this.displayDate = newDisplayDate;
      this.selectedDate = newSelectedDate || this.selectedDate;

      this.dateSelected.emit(this.selectedDate);
    }
  }
}
