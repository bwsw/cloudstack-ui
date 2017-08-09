import { Observable } from 'rxjs/Observable';
import { Color } from '../../../app/shared/models/color.model';
import { DayOfWeek } from '../../../app/shared/types/day-of-week';
import { Language, Languages, TimeFormat, TimeFormats } from '../../../app/shared/services/language.service';


interface UserIdObject {
  id: string;
}

export class MockUserTagService {
  private get user(): UserIdObject {
    return {
      id: 'id'
    };
  }

  public getAccentColor(): Observable<string> {
    return Observable.of('');
  }

  public setAccentColor(color: Color): Observable<Color> {
    return Observable.of(color);
  }

  public getAskToCreateVm(): Observable<boolean> {
    return Observable.of(false);
  }

  public setAskToCreateVm(ask: boolean): Observable<boolean> {
    return Observable.of(false);
  }

  public getAskToCreateVolume(): Observable<boolean> {
    return Observable.of(false);
  }

  public setAskToCreateVolume(ask: boolean): Observable<boolean> {
    return Observable.of(false);
  }

  public getFirstDayOfWeek(): Observable<DayOfWeek> {
    return Observable.of(DayOfWeek.Sunday);
  }

  public setFirstDayOfWeek(dayOfWeek: DayOfWeek): Observable<DayOfWeek> {
    return Observable.of(DayOfWeek.Sunday);
  }

  public getLang(): Observable<Language> {
    return Observable.of(Languages.en);
  }

  public setLang(language: Language): Observable<Language> {
    return Observable.of(Languages.en);
  }

  public getLastVmId(): Observable<number> {
    return Observable.of(1);
  }

  public setLastVmId(id: number): Observable<number> {
    return Observable.of(1);
  }

  public getPrimaryColor(): Observable<string> {
    return Observable.of('');
  }

  public setPrimaryColor(color: Color): Observable<Color> {
    return Observable.of(color);
  }

  public getSessionTimeout(): Observable<number> {
    return Observable.of(0);
  }

  public setSessionTimeout(timeout: number): Observable<number> {
    return Observable.of(0);
  }

  public getTimeFormat(): Observable<TimeFormat> {
    return Observable.of(TimeFormats.AUTO);
  }

  public setTimeFormat(timeFormat: TimeFormat): Observable<TimeFormat> {
    return Observable.of(TimeFormats.AUTO);
  }

  public removeTimeFormat(): Observable<void> {
    return Observable.of(null);
  }

  public writeTag(key: string, value: string): Observable<string> {
    return Observable.of(value);
  }

  public readTag(key: string): Observable<string> {
    return Observable.of('');
  }

  public removeTag(key: string): Observable<void> {
    return Observable.of(null);
  }
}
