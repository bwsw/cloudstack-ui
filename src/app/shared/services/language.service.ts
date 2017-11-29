import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { DayOfWeek } from '../types/day-of-week';
import { UserTagService } from './tags/user-tag.service';


export enum Language {
  en = 'en',
  ru = 'ru'
}

const DEFAULT_LANGUAGE = Language.en;

export enum TimeFormat {
  hour12 = 'hour12',
  hour24 = 'hour24',
  AUTO = 'auto'
}

@Injectable()
export class LanguageService {
  constructor(
    private storage: LocalStorageService,
    private translate: TranslateService,
    private userTagService: UserTagService
  ) {
    if (!translate.defaultLang) {
      translate.setDefaultLang(DEFAULT_LANGUAGE);
    }
  }

  public getLanguage(): Observable<Language> {
    return this.userTagService.getLang()
      .map(lang => lang || this.defaultLanguage);
  }

  public setLanguage(lang: Language): Observable<any> {
    this.storage.write('lang', lang);
    return this.userTagService.setLang(lang)
      .switchMap(() => this.applyLanguage(lang));
  }

  public applyLanguage(language): Observable<any> {
    return this.translate.use(language)
      .catch(() => this.translate.use(this.defaultLanguage));
  }

  public getFirstDayOfWeek(): Observable<DayOfWeek> {
    return this.userTagService.getFirstDayOfWeek()
      .map(dayRaw => {
        const fallbackDay = this.storage.read('lang') === Language.en
          ? DayOfWeek.Sunday
          : DayOfWeek.Monday;
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

  public getTimeFormat(): Observable<TimeFormat> {
    return this.userTagService.getTimeFormat()
      .map(timeFormat => {
        switch (timeFormat) {
          case TimeFormat.hour12:
          case TimeFormat.hour24:
            return timeFormat;
          default:
            return TimeFormat.AUTO;
        }
      });
  }

  public setTimeFormat(timeFormat: TimeFormat): Observable<string> {
    if (timeFormat === TimeFormat.AUTO) {
      return this.userTagService.removeTimeFormat().map(() => TimeFormat.AUTO);
    }

    return this.userTagService.setTimeFormat(timeFormat);
  }

  public get defaultLanguage(): Language {
    const storedLang = this.storage.read('lang');
    const language = storedLang || navigator.language && navigator.language.substr(0, 2);
    if (language === Language.ru || language === Language.en) {
      return language;
    }
    return DEFAULT_LANGUAGE;
  }
}
