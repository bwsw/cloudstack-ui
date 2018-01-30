import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ResourceTypes } from '../../models/tag.model';
import { DayOfWeek } from '../../types/day-of-week';
import { AuthService } from '../auth.service';
import { Language, TimeFormat } from '../language.service';
import { Utils } from '../utils/utils.service';
import { EntityTagService } from './entity-tag-service.interface';
import { TagService } from './tag.service';
import { UserTagKeys } from './user-tag-keys';


interface UserIdObject {
  id: string;
}

@Injectable()
export class UserTagService implements EntityTagService {
  public keys = UserTagKeys;

  constructor(
    private authService: AuthService,
    protected tagService: TagService
  ) {}

  private get user(): UserIdObject {
    const user = this.authService.user;
    return user ? { id: user.userid } : undefined;
  }

  public getTheme(): Observable<string> {
    return this.readTag(this.keys.theme);
  }

  public setTheme(themeName: string): Observable<string> {
    return this.writeTag(this.keys.theme, themeName)
      .mapTo(themeName);
  }

  public getAskToCreateVm(): Observable<boolean> {
    return this.readTag(this.keys.askToCreateVm)
      .map(value => Utils.convertBooleanStringToBoolean(value));
  }

  public setAskToCreateVm(ask: boolean): Observable<boolean> {
    return this.writeTag(
      this.keys.askToCreateVm,
      Utils.convertBooleanToBooleanString(ask)
    )
      .map(() => ask);
  }

  public getAskToCreateVolume(): Observable<boolean> {
    return this.readTag(this.keys.askToCreateVolume)
      .map(value => Utils.convertBooleanStringToBoolean(value));
  }

  public setAskToCreateVolume(ask: boolean): Observable<boolean> {
    return this.writeTag(
      this.keys.askToCreateVolume,
      Utils.convertBooleanToBooleanString(ask)
    )
      .map(() => ask);
  }

  public getSavePasswordForAllVms(): Observable<boolean> {
    return this.readTag(this.keys.savePasswordForAllVms)
      .map(value => Utils.convertBooleanStringToBoolean(value));
  }

  public setSavePasswordForAllVms(ask: boolean): Observable<boolean> {
    return this.writeTag(
      this.keys.savePasswordForAllVms,
      Utils.convertBooleanToBooleanString(ask)
    )
      .map(() => ask);
  }

  public setKeyboardLayoutForVms(value: any): Observable<any> {
    return this.writeTag(
      this.keys.keyboardLayoutForVms,
      value
    )
      .map(() => value);
  }

  public getKeyboardLayoutForVms(): Observable<any> {
    return this.readTag(
      this.keys.keyboardLayoutForVms,
    );
  }

  public getFirstDayOfWeek(): Observable<DayOfWeek> {
    return this.readTag(this.keys.firstDayOfWeek).map(value => +value);
  }

  public setFirstDayOfWeek(dayOfWeek: DayOfWeek): Observable<DayOfWeek> {
    return this.writeTag(this.keys.firstDayOfWeek, dayOfWeek.toString())
      .map(() => dayOfWeek);
  }

  public getLang(): Observable<Language> {
    return this.readTag(this.keys.lang) as Observable<Language>;
  }

  public setLang(language: Language): Observable<Language> {
    return this.writeTag(this.keys.lang, language) as Observable<Language>;
  }

  public getLastVmId(): Observable<number> {
    return this.readTag(this.keys.lastVmId)
      .map(id => +id);
  }

  public setLastVmId(id: number): Observable<number> {
    return this.writeTag(this.keys.lastVmId, id.toString())
      .map(() => id);
  }

  public getSessionTimeout(): Observable<number> {
    return this.readTag(this.keys.sessionTimeout)
      .map(timeout => +timeout);
  }

  public setSessionTimeout(timeout: number): Observable<number> {
    return this.writeTag(this.keys.sessionTimeout, timeout.toString())
      .map(() => +timeout);
  }

  public getShowSystemTags(): Observable<boolean> {
    return this.readTag(this.keys.showSystemTags)
      .map(value => Utils.convertBooleanStringToBoolean(value));
  }

  public setShowSystemTags(show: boolean): Observable<boolean> {
    return this.writeTag(
      this.keys.showSystemTags,
      Utils.convertBooleanToBooleanString(show)
    )
      .map(() => show);
  }

  public getTimeFormat(): Observable<TimeFormat> {
    return this.readTag(this.keys.timeFormat) as Observable<TimeFormat>;
  }

  public setTimeFormat(timeFormat: TimeFormat): Observable<TimeFormat> {
    return this.writeTag(this.keys.timeFormat, timeFormat) as Observable<TimeFormat>;
  }

  public removeTimeFormat(): Observable<void> {
    return this.removeTag(this.keys.timeFormat);
  }

  public getNavigationOrder(): Observable<string> {
    return this.readTag(this.keys.navigationOrder);
  }

  public setNavigationOrder(orderStringified: string): Observable<string> {
    return this.writeTag(this.keys.navigationOrder, orderStringified);
  }

  public writeTag(key: string, value: string): Observable<string> {
    const user = this.user;

    if (user) {
      return this.tagService.update(user, 'User', key, value)
        .map(() => value);
    }

    return Observable.of(null);
  }

  public readTag(key: string): Observable<string> {
    const user = this.user;

    if (user) {
      return this.tagService.getTag(user, key)
        .map(tag => this.tagService.getValueFromTag(tag));
    }

    return Observable.of(null);
  }

  public removeTag(key: string): Observable<void> {
    const user = this.user;

    if (user) {
      return this.tagService.remove({
        resourceIds: user.id,
        resourceType: ResourceTypes.USER,
        'tags[0].key': key
      });
    }

    return Observable.of(null);
  }
}
