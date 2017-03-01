import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {
  getFirstDayOfMonth,
  localizedWeekday,
  getWeekArray,
  addMonths,
  isEqualDate
} from './dateUtils';
import { dateTimeFormat as DateTimeFormat } from './dateUtils';


const daysArray = [
  0, 1, 2, 3, 4, 5, 6
];

@Component({
  selector: 'cs-calendar',
  templateUrl: 'calendar.component.html',
  styleUrls: ['calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @Input() public initialDate: Date;
  @Output() public dateSelected = new EventEmitter<Date>();

  public displayDate: Date;
  public selectedDate: Date;

  private locale;

  constructor() {
    this.locale = 'en-US';
  }

  public ngOnInit(): void {
    this.displayDate = getFirstDayOfMonth(this.initialDate);
    this.selectedDate = this.initialDate;
  }

  public get year(): string {
    return new DateTimeFormat(this.locale, {
      year: 'numeric',
    }).format(this.selectedDate);
  }

  public get dateTime(): string {
    return new DateTimeFormat(this.locale, {
      month: 'short',
      weekday: 'short',
      day: '2-digit',
    }).format(this.selectedDate);
  }

  public get dateTimeFormatted(): string {
    return new DateTimeFormat(this.locale, {
      month: 'long',
      year: 'numeric',
    }).format(this.displayDate);
  }

  public get weekTitles(): Array<string> {
    return daysArray.map((_event, i) => {
      return localizedWeekday(DateTimeFormat, this.locale, i, 0);
    });
  }

  public get weekElements(): Array<Array<Date>> {
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

  public setSelectedDate(_e: Event, day: Date): void {
    const newDisplayDate = getFirstDayOfMonth(day);
    if (newDisplayDate !== this.displayDate) {
      this.setDisplayDate(newDisplayDate, day);
    }
  }

  public isSameDate(date): boolean {
    return isEqualDate(this.selectedDate, date);
  }

  public onMonthChange(shift: number): void {
    this.displayDate = addMonths(this.displayDate, shift);
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
