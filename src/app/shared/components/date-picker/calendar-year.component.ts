import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';

import {
  cloneDate,
  dateTimeFormat as DateTimeFormat
} from './dateUtils';


@Component({
  selector: 'cs-calendar-year',
  templateUrl: 'calendar-year.component.html',
  styleUrls: ['calendar-year.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarYearComponent implements AfterViewInit {
  @Input() public minDate: Date;
  @Input() public maxDate: Date;
  @Input() public selectedDate: Date;
  @Input() public locale: string;
  @Output() public yearSelected = new EventEmitter<number>();

  @ViewChild('calendarYearElement') private calendarYearElement;
  @ViewChild('selectedYearElement') private selectedYearElement;

  constructor(private cdr: ChangeDetectorRef) { }

  public ngAfterViewInit(): void {
    this.scrollIntoSelectedYear();
    this.cdr.detach();
  }

  public get years(): Array<string> {
    const minYear = this.minDate.getFullYear();
    const maxYear = this.maxDate.getFullYear();
    const years = [];
    const dateCheck = cloneDate(this.selectedDate);

    for (let year = minYear; year <= maxYear; year++) {
      dateCheck.setFullYear(year);
      const yearFormatted = new DateTimeFormat(this.locale, {
        year: 'numeric',
      }).format(dateCheck);

      years.push(yearFormatted);
    }

    return years;
  }

  public setYear(year: number): void {
    this.yearSelected.emit(year);
  }

  private scrollIntoSelectedYear(): void {
    if (!this.selectedYearElement || !this.selectedYearElement.nativeElement) {
      return;
    }

    const containerHeight = this.calendarYearElement.nativeElement.clientHeight;
    const selectedYearNodeHeight = this.selectedYearElement.nativeElement.clientHeight || 32;
    const selectedYearNodeOffsetTop = this.selectedYearElement.nativeElement.parentNode.offsetTop;

    const scrollYOffset = (selectedYearNodeOffsetTop + selectedYearNodeHeight / 2) - containerHeight / 2;
    this.calendarYearElement.nativeElement.scrollTop = scrollYOffset;
  }
}
