import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService, TimeFormat } from './language.service';
import { dateTimeFormat as enDateTimeFormat } from '../../shared/components/date-picker/dateUtils';
import DateTimeFormat = Intl.DateTimeFormat;


@Injectable()
export class DateTimeFormatterService {
  private dateFormatter: DateTimeFormat;
  private timeFormatter: DateTimeFormat;

  constructor(
    private languageService: LanguageService,
    private translateService: TranslateService
  ) {
    this.initializeFormatter();
    this.subscribeToLanguageUpdates();
    this.subscribeToTimeFormatUpdates();
  }

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
      return this.timeFormatter.format(date);
    }

    return '';
  }

  public stringifyToDate(date: Date): string {
    if (this.dateFormatter) {
      return this.dateFormatter.format(date);
    }

    return '';
  }

  private updateFormatters(timeFormat: any): void {
    this.updateTimeFormatter(timeFormat);
    this.updateDateFormatter(timeFormat);
  }

  private updateTimeFormatter(timeFormat: any): void {
    this.timeFormatter = new Intl.DateTimeFormat(
      this.translateService.currentLang,
      this.getTimeFormatterOptions(timeFormat)
    );
  }

  private updateDateFormatter(timeFormat: any): void {
    this.dateFormatter = new Intl.DateTimeFormat(
      this.translateService.currentLang,
      this.getDateFormatterOptions(timeFormat)
    );
  }

  private getDateFormatterOptions(timeFormat: any): any {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short'
    };

    if (timeFormat !== TimeFormat.AUTO) {
      options.hour12 = timeFormat === TimeFormat['12h'];
    }

    return options;
  }

  private getTimeFormatterOptions(timeFormat: any): any {
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short'
    };

    if (timeFormat !== TimeFormat.AUTO) {
      options.hour12 = timeFormat === TimeFormat['12h'];
    }

    return options;
  }

  private initializeFormatter(): void {
    this.languageService.getTimeFormat()
      .subscribe(timeFormat => {
        this.updateFormatters(timeFormat);
      });
  }

  private subscribeToLanguageUpdates(): void {
    this.translateService.onLangChange
      .subscribe(() => {
        this.updateFormatters(this.languageService.timeFormat.getValue());
      });
  }

  private subscribeToTimeFormatUpdates(): void {
    this.languageService.timeFormat
      .subscribe(timeFormat => {
        this.updateFormatters(timeFormat);
      });
  }
}
