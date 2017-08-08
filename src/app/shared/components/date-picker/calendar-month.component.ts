import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import {
  getWeekArray,
  isEqualDate,
  getFirstDayOfMonth
} from './dateUtils';


@Component({
  selector: 'cs-calendar-month',
  templateUrl: 'calendar-month.component.html',
  styleUrls: ['calendar-month.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarMonthComponent {
  @Input() public locale: string;
  @Input() public firstDayOfWeek: number;
  @Input() public displayDate: Date;
  @Input() public selectedDate: Date;
  @Input() public DateTimeFormat;

  @Output() public dateSelected = new EventEmitter<Date>();

  public get weekElements(): Array<Array<Date>> {
    return getWeekArray(this.displayDate, this.firstDayOfWeek);
  }

  public getDay(date): string|null {
    if (!date) {
      return null;
    }
    return new this.DateTimeFormat(this.locale, {
      day: 'numeric',
    }).format(date);
  }

  public isSameDate(date): boolean {
    return isEqualDate(this.selectedDate, date);
  }

  public isToday(date): boolean {
    return isEqualDate(date, new Date());
  }

  public setSelectedDate(_e: Event, day: Date): void {
    if (!day) {
      return;
    }
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
