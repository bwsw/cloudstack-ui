import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { UserService } from './user.service';
import { DayOfWeek } from '../types/day-of-week';


const DEFAULT_LANGUAGE = 'en';

export type TimeFormat = 'hour12' | 'hour24' | 'auto';
export const TimeFormats = {
  'hour12': 'hour12' as TimeFormat,
  'hour24': 'hour24' as TimeFormat,
  AUTO: 'auto'
};

@Injectable()
export class LanguageService {
  constructor(
    private storage: StorageService,
    private translate: TranslateService,
    private userService: UserService
  ) {}

  public getLanguage(): Observable<string> {
    return this.userService.readTag('csui.user.lang').map(lang => {
      return lang || this.defaultLanguage;
    });
  }

  public setLanguage(lang: string): void {
    this.storage.write('lang', lang);
    this.userService.writeTag('csui.user.lang', lang).subscribe(() => this.applyLanguage());
  }

  public applyLanguage(): void {
    this.getLanguage().subscribe(
      lang => this.translate.use(lang),
      () => this.translate.use(this.defaultLanguage)
    );
  }

  public getFirstDayOfWeek(): Observable<DayOfWeek> {
    return this.userService.readTag('csui.user.first-day-of-week')
      .map(dayRaw => {
        const fallbackDay = this.storage.read('lang') === 'en' ? DayOfWeek.Sunday : DayOfWeek.Monday;
        if (dayRaw === undefined) {
          return fallbackDay;
        }
        const day = +dayRaw;
        if (isNaN(day) || (day < 0 || day > 6)) {
          return fallbackDay;
        }
        return day;
      });
  }

  public getTimeFormat(): Observable<string> {
    return this.userService.readTag('csui.user.time-format')
      .map(timeFormat => {
        switch (timeFormat) {
          case TimeFormats.hour12:
          case TimeFormats.hour24:
            return timeFormat;
          default:
            return TimeFormats.AUTO;
        }
      });
  }

  public setTimeFormat(timeFormat: string): Observable<string> {
    return (timeFormat === TimeFormats.AUTO
      ? this.userService.removeTag('csui.user.time-format')
      : this.userService.writeTag('csui.user.time-format', timeFormat)).mapTo(timeFormat);
  }

  private get defaultLanguage(): string {
    const language = navigator.language && navigator.language.substr(0, 2);
    if (language === 'ru' || language === 'en') {
      return language;
    }
    return DEFAULT_LANGUAGE;
  }
}
