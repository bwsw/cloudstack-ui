import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {
  addMonths,
  dateTimeFormat as DateTimeFormat,
  getFirstDayOfMonth,
  localizedWeekday
} from './dateUtils';


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

  public onMonthChange(shift: number): void {
    this.displayDate = addMonths(this.displayDate, shift);
  }

  public onDateSelected(newDate: Date): void {
    this.selectedDate = newDate;
    this.dateSelected.emit(newDate);
  }
}
