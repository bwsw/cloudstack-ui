import { Observable, of } from 'rxjs';

import { Color } from '../../../app/shared/models';
import { DayOfWeek, Language, TimeFormat } from '../../../app/shared/types';

export class MockUserTagService {
  public getAccentColor(): Observable<string> {
    return of('');
  }

  public setAccentColor(color: Color): Observable<Color> {
    return of(color);
  }

  public getAskToCreateVm(): Observable<boolean> {
    return of(false);
  }

  public setAskToCreateVm(ask: boolean): Observable<boolean> {
    return of(false);
  }

  public getAskToCreateVolume(): Observable<boolean> {
    return of(false);
  }

  public setAskToCreateVolume(ask: boolean): Observable<boolean> {
    return of(false);
  }

  public getFirstDayOfWeek(): Observable<DayOfWeek> {
    return of(DayOfWeek.Sunday);
  }

  public setFirstDayOfWeek(dayOfWeek: DayOfWeek): Observable<DayOfWeek> {
    return of(DayOfWeek.Sunday);
  }

  public getLang(): Observable<Language> {
    return of(Language.en);
  }

  public setLang(language: Language): Observable<Language> {
    return of(Language.en);
  }

  public getLastVmId(): Observable<number> {
    return of(1);
  }

  public setLastVmId(id: number): Observable<number> {
    return of(1);
  }

  public getPrimaryColor(): Observable<string> {
    return of('');
  }

  public setPrimaryColor(color: Color): Observable<Color> {
    return of(color);
  }

  public getSessionTimeout(): Observable<number> {
    return of(0);
  }

  public setSessionTimeout(timeout: number): Observable<number> {
    return of(0);
  }

  public getTimeFormat(): Observable<TimeFormat> {
    return of(TimeFormat.AUTO);
  }

  public setTimeFormat(timeFormat: TimeFormat): Observable<TimeFormat> {
    return of(TimeFormat.AUTO);
  }

  public removeTimeFormat(): Observable<void> {
    return of(null);
  }

  public writeTag(key: string, value: string): Observable<string> {
    return of(value);
  }

  public readTag(key: string): Observable<string> {
    return of('');
  }

  public removeTag(key: string): Observable<void> {
    return of(null);
  }
}
