import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { dateTimeFormat as enDateTimeFormat } from '../components/date-picker/dateUtils';
import { TimeFormat } from '../types';
import DateTimeFormat = Intl.DateTimeFormat;

@Injectable()
export class DateTimeFormatterService {
  private dateFormatter: DateTimeFormat;
  private timeFormatter: DateTimeFormat;

  constructor(private translateService: TranslateService) {}

  public get dateTimeFormat(): any {
    if (this.translateService.currentLang === 'en') {
      return enDateTimeFormat;
    }

    if (this.translateService.currentLang === 'ru') {
      return Intl.DateTimeFormat;
    }
  }

  public stringifyToTime(date: Date): string {
    if (this.timeFormatter) {
      const formattedTime = this.timeFormatter.format(date);
      return this.removeAmPmLocalization(formattedTime);
    }

    return '';
  }

  public stringifyToDate(date: Date): string {
    if (this.dateFormatter) {
      const formattedDate = this.dateFormatter.format(date);
      return this.removeAmPmLocalization(formattedDate);
    }

    return '';
  }

  public updateFormatters(timeFormat: any): void {
    this.updateTimeFormatter(timeFormat);
    this.updateDateFormatter(timeFormat);
  }

  private updateTimeFormatter(timeFormat: any): void {
    this.timeFormatter = new Intl.DateTimeFormat(
      this.translateService.currentLang,
      this.getTimeFormatterOptions(timeFormat),
    );
  }

  private updateDateFormatter(timeFormat: any): void {
    this.dateFormatter = new Intl.DateTimeFormat(
      this.translateService.currentLang,
      this.getDateFormatterOptions(timeFormat),
    );
  }

  private getDateFormatterOptions(timeFormat: any): any {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short',
    };

    if (timeFormat !== TimeFormat.AUTO) {
      options.hour12 = timeFormat === TimeFormat.hour12;
    }

    return options;
  }

  private getTimeFormatterOptions(timeFormat: any): any {
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short',
    };

    if (timeFormat !== TimeFormat.AUTO) {
      options.hour12 = timeFormat === TimeFormat.hour12;
    }

    return options;
  }

  private removeAmPmLocalization(date: string): string {
    return date.replace('ПП', 'PM').replace('ДП', 'AM');
  }
}
