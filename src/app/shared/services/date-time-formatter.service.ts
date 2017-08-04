import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService, TimeFormat } from './language.service';
import { dateTimeFormat as enDateTimeFormat } from '../../shared/components/date-picker/dateUtils';


@Injectable()
export class DateTimeFormatterService {
  public formatter: any;

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

  public stringifyDate(date: Date): string {
    if (this.formatter) {
      return this.formatter.format(date);
    }

    return '';
  }

  private updateFormatter(timeFormat: any): void {
    this.formatter = new Intl.DateTimeFormat(
      this.translateService.currentLang,
      this.getFormatterOptions(timeFormat)
    );
  }

  private getFormatterOptions(timeFormat: any): any {
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
        this.updateFormatter(timeFormat);
      });
  }

  private subscribeToLanguageUpdates(): void {
    this.translateService.onLangChange
      .subscribe(() => {
        this.updateFormatter(this.languageService.timeFormat.getValue());
      });
  }

  private subscribeToTimeFormatUpdates(): void {
    this.languageService.timeFormat
      .subscribe(timeFormat => {
        this.updateFormatter(timeFormat);
      });
  }
}
