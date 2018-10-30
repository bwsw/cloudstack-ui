import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { addMonths, addYears, cloneDate, getFirstDayOfMonth, localizedWeekday } from './dateUtils';

const daysArray = [0, 1, 2, 3, 4, 5, 6];

@Component({
  selector: 'cs-calendar',
  templateUrl: 'calendar.component.html',
  styleUrls: ['calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  @Input()
  public initialDate: Date;
  @Input()
  public firstDayOfWeek: number;
  @Input()
  public minDate: Date = addYears(new Date(), -100);
  @Input()
  public maxDate: Date = addYears(new Date(), 100);
  @Input()
  public locale;
  @Input()
  public dateTimeFormat;

  @Output()
  public dateSelected = new EventEmitter<Date>();

  public displayDate: Date;
  public selectedDate: Date;

  public displayMonth = true;

  public ngOnInit(): void {
    this.displayDate = getFirstDayOfMonth(this.initialDate);
    this.selectedDate = this.initialDate;
  }

  public get dateTimeFormatted(): string {
    return new this.dateTimeFormat(this.locale, {
      month: 'long',
      year: 'numeric',
    }).format(this.displayDate);
  }

  public get weekTitles(): string[] {
    return daysArray.map((event, i) => {
      return localizedWeekday(this.dateTimeFormat, this.locale, i, this.firstDayOfWeek);
    });
  }

  public onMonthChange(shift: number): void {
    this.displayDate = addMonths(this.displayDate, shift);
  }

  public onDateSelected(newDate: Date): void {
    this.selectedDate = newDate;
    this.dateSelected.emit(newDate);
  }

  public onYearSelected(year: number): void {
    const date = cloneDate(this.selectedDate);
    date.setFullYear(year);

    this.displayMonth = true;
    this.selectedDate = date;
    this.displayDate = date;
    this.dateSelected.emit(date);
  }
}
