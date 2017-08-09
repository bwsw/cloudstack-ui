import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DayOfWeek } from '../types/day-of-week';
import { UserTagService } from './tags/user-tag.service';


export type Language = 'en' | 'ru';
export const Languages = {
  en: 'en' as Language,
  ru: 'ru' as Language
};

const DEFAULT_LANGUAGE = Languages.en;

export type TimeFormat = 'hour12' | 'hour24' | 'auto';
export const TimeFormats = {
  'hour12': 'hour12' as TimeFormat,
  'hour24': 'hour24' as TimeFormat,
  AUTO: 'auto'
};

@Injectable()
export class LanguageService {
  public firstDayOfWeek = new BehaviorSubject<number>(undefined);
  public timeFormat = new BehaviorSubject<string>(undefined);

  constructor(
    private storage: LocalStorageService,
    private translate: TranslateService,
    private userTagService: UserTagService
  ) {
    this.initializeFirstDayOfWeek();
    this.initializeTimeFormat();
  }

  public getLanguage(): Observable<Language> {
    return this.userTagService.getLang()
      .map(lang => lang || this.defaultLanguage);
  }

  public setLanguage(lang: Language): void {
    this.storage.write('lang', lang);
    this.userTagService.setLang(lang)
      .subscribe(() => this.applyLanguage());
  }

  public applyLanguage(): void {
    this.getLanguage().subscribe(
      lang => this.translate.use(lang),
      () => this.translate.use(this.defaultLanguage)
    );
  }

  public getFirstDayOfWeek(): Observable<DayOfWeek> {
    return this.userTagService.getFirstDayOfWeek()
      .map(dayRaw => {
        const fallbackDay = this.storage.read('lang') === Languages.en ? DayOfWeek.Sunday : DayOfWeek.Monday;
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

  public setFirstDayOfWeek(day: DayOfWeek): Observable<DayOfWeek> {
    return this.userTagService.setFirstDayOfWeek(day)
      .do(_ => this.firstDayOfWeek.next(day));
  }

  public getTimeFormat(): Observable<TimeFormat> {
    return this.userTagService.getTimeFormat()
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

  public setTimeFormat(timeFormat: TimeFormat): Observable<string> {
    if (timeFormat === TimeFormats.AUTO) {
      return this.userTagService.removeTimeFormat().map(() => TimeFormats.AUTO);
    }

    return this.userTagService.setTimeFormat(timeFormat);
  }

  private get defaultLanguage(): Language {
    const language = navigator.language && navigator.language.substr(0, 2);
    if (language === Languages.ru || language === Languages.en) {
      return language;
    }
    return DEFAULT_LANGUAGE;
  }

  private initializeFirstDayOfWeek(): void {
    this.getFirstDayOfWeek().subscribe(firstDayOfWeek => {
      this.firstDayOfWeek.next(firstDayOfWeek);
    });
  }

  private initializeTimeFormat(): void {
    this.getTimeFormat().subscribe(timeFormat => {
      this.timeFormat.next(timeFormat);
    });
  }
}
