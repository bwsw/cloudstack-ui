import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';

import { cloneDate } from './dateUtils';

@Component({
  selector: 'cs-calendar-year',
  templateUrl: 'calendar-year.component.html',
  styleUrls: ['calendar-year.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarYearComponent implements AfterViewInit {
  @Input()
  public minDate: Date;
  @Input()
  public maxDate: Date;
  @Input()
  public selectedDate: Date;
  @Input()
  public locale: string;
  @Input()
  public dateTimeFormat;

  @Output()
  public yearSelected = new EventEmitter<number>();

  @ViewChild('calendarYearElement')
  private calendarYearElement;
  @ViewChild('selectedYearElement')
  private selectedYearElement;

  constructor(private cdr: ChangeDetectorRef, private renderer: Renderer2) {}

  public ngAfterViewInit(): void {
    this.scrollIntoSelectedYear();
    this.cdr.detach();
  }

  public get years(): string[] {
    const minYear = this.minDate.getFullYear();
    const maxYear = this.maxDate.getFullYear();
    const years = [];
    const dateCheck = cloneDate(this.selectedDate);

    for (let year = minYear; year <= maxYear; year += 1) {
      dateCheck.setFullYear(year);
      years.push(dateCheck.getFullYear());
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

    const calendarYear = this.calendarYearElement.nativeElement;
    const selectedYear = this.selectedYearElement.nativeElement;

    const containerHeight = calendarYear.clientHeight;
    const selectedYearNodeHeight: number = selectedYear.clientHeight || 32;
    const selectedYearNodeOffsetTop: number = selectedYear.parentNode.offsetTop;

    const scrollYOffset =
      selectedYearNodeOffsetTop + selectedYearNodeHeight / 2 - containerHeight / 2;
    this.renderer.setProperty(calendarYear, 'scrollTop', scrollYOffset);
  }
}
