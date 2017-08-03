import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { UserService } from './user.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


const DEFAULT_LANGUAGE = 'en';

export const TimeFormat = {
  '12h': '12h',
  '24h': '24h',
  AUTO: 'auto'
};

@Injectable()
export class LanguageService {
  public onTimeFormatChange = new BehaviorSubject<string>(TimeFormat.AUTO);

  constructor(
    private storage: StorageService,
    private translate: TranslateService,
    private userService: UserService
  ) {}

  public getLanguage(): Observable<string> {
    return this.userService.readTag('lang').map(lang => {
      return lang || this.defaultLanguage;
    });
  }

  public setLanguage(lang: string): void {
    this.storage.write('lang', lang);
    this.userService.writeTag('lang', lang).subscribe(() => this.applyLanguage());
  }

  public applyLanguage(): void {
    this.getLanguage().subscribe(
      lang => this.translate.use(lang),
      () => this.translate.use(this.defaultLanguage)
    );
  }

  public getFirstDayOfWeek(): Observable<number> {
    return this.userService.readTag('firstDayOfWeek')
      .map(dayRaw => {
        const fallbackDay = this.storage.read('lang') === 'en' ? 0 : 1;
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
    return this.userService.readTag('timeFormat')
      .map(timeFormat => {
        switch (timeFormat) {
          case TimeFormat['12h']:
          case TimeFormat['24h']:
            return timeFormat;
          default: return TimeFormat.AUTO;
        }
      });
  }

  public setTimeFormat(timeFormat: string): Observable<string> {
    return (
      timeFormat === TimeFormat.AUTO
        ? this.userService.removeTag('timeFormat')
        : this.userService.writeTag('timeFormat', timeFormat)
    )
      .map(() => timeFormat)
      .do(_ => this.onTimeFormatChange.next(_));
  }

  private get defaultLanguage(): string {
    const language = navigator.language && navigator.language.substr(0, 2);
    if (language === 'ru' || language === 'en') {
      return language;
    }
    return DEFAULT_LANGUAGE;
  }
}
