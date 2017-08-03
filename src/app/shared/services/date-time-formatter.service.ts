import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService, TimeFormats } from './language.service';
import { dateTimeFormat as enDateTimeFormat } from '../../shared/components/date-picker/dateUtils';


@Injectable()
export class DateTimeFormatterService {
  public formatter: any;
  public timeFormat: string;

  constructor(
    private languageService: LanguageService,
    private translateService: TranslateService
  ) {
    this.setDateTimeFormat();
    this.translateService.onLangChange
      .subscribe(() => this.setDateTimeFormat());

    this.languageService.onTimeFormatChange
      .subscribe(timeFormat => {
        this.timeFormat = timeFormat;
        this.setDateTimeFormat();

        // this.getEvents({ reload: true });
      });

    this.translateService.onLangChange
      .subscribe(() => this.setDateTimeFormat());

  }

  public get dateTimeFormat(): any {
    if (this.translateService.currentLang === 'en') {
      return enDateTimeFormat;
    }

    if (this.translateService.currentLang === 'ru') {
      return Intl.DateTimeFormat;
    }
  }

  private get formatterOptions(): any {
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short'
    };

    if (this.timeFormat !== TimeFormats.AUTO) {
      options.hour12 = this.timeFormat === TimeFormats['12h'];
    }

    return options;
  }

  public stringifyDate(date: Date): string {
    return this.formatter.format(date);
  }

  private setDateTimeFormat(): void {
    this.formatter = new Intl.DateTimeFormat(
      this.translateService.currentLang,
      this.formatterOptions
    );
  }
}
