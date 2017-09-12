import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DayOfWeek } from '../types/day-of-week';
import { UserTagService } from './tags/user/user-tag.service';


export enum Language {
  en = 'en',
  ru = 'ru',
  cn = 'cn'
}

const DEFAULT_LANGUAGE = Language.en;

export enum TimeFormat {
  hour12 = 'hour12',
  hour24 = 'hour24',
  AUTO = 'auto'
}

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
        const fallbackDay = this.storage.read('lang') === Language.en ? DayOfWeek.Sunday : DayOfWeek.Monday;
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

  public initializeFirstDayOfWeek(): void {
    this.getFirstDayOfWeek().subscribe(firstDayOfWeek => {
      this.firstDayOfWeek.next(firstDayOfWeek);
    });
  }

  private get defaultLanguage(): Language {
    const language = navigator.language && navigator.language.substr(0, 2);
    if (language === Language.ru || language === Language.en) {
      return language;
    }
    return DEFAULT_LANGUAGE;
  }

  private initializeTimeFormat(): void {
    this.getTimeFormat().subscribe(timeFormat => {
      this.timeFormat.next(timeFormat);
    });
  }
}
