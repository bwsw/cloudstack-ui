import { Injectable } from '@angular/core';
import { TagService } from './tag.service';
import { Observable } from 'rxjs/Observable';
import { ResourceTypes } from '../../models/tag.model';
import { Color } from '../../models/color.model';
import { Utils } from '../utils.service';
import { DayOfWeek } from '../../types/day-of-week';
import { Language, TimeFormat } from '../language.service';
import { LocalStorageService } from '../local-storage.service';
import { EntityTagService } from './entity-tag-service.interface';


export const UserTagKeys = {
  accentColor: 'csui.user.accent-color',
  askToCreateVm: 'csui.user.ask-to-create-vm',
  askToCreateVolume: 'csui.user.ask-to-create-volume',
  firstDayOfWeek: 'csui.user.first-day-of-week',
  lang: 'csui.user.lang',
  lastVmId: 'csui.user.last-vm-id',
  primaryColor: 'csui.user.primary-color',
  sessionTimeout: 'csui.user.session-timeout',
  timeFormat: 'csui.user.time-format'
};

interface UserIdObject {
  id: string;
}

@Injectable()
export class UserTagService implements EntityTagService {
  public keys = UserTagKeys;

  constructor(
    private storageService: LocalStorageService,
    protected tagService: TagService
  ) {}

  private get user(): UserIdObject {
    const id = this.storageService.read('userId');
    return id ? { id } : undefined;
  }

  public getAccentColor(): Observable<string> {
    return this.readTag(this.keys.accentColor);
  }

  public setAccentColor(color: Color): Observable<Color> {
    return this.writeTag(this.keys.accentColor, color.name)
      .map(() => color);
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

  public getFirstDayOfWeek(): Observable<DayOfWeek> {
    return this.readTag(this.keys.firstDayOfWeek).map(value => +value);
  }

  public setFirstDayOfWeek(dayOfWeek: DayOfWeek): Observable<DayOfWeek> {
    return this.writeTag(this.keys.firstDayOfWeek, dayOfWeek.toString())
      .map(() => dayOfWeek);
  }

  public getLang(): Observable<Language> {
    return this.readTag(this.keys.lang);
  }

  public setLang(language: Language): Observable<Language> {
    return this.writeTag(this.keys.lang, language);
  }

  public getLastVmId(): Observable<number> {
    return this.readTag(this.keys.lastVmId)
      .map(id => +id);
  }

  public setLastVmId(id: number): Observable<number> {
    return this.writeTag(this.keys.lastVmId, id.toString())
      .map(() => id);
  }

  public getPrimaryColor(): Observable<string> {
    return this.readTag(this.keys.primaryColor);
  }

  public setPrimaryColor(color: Color): Observable<Color> {
    return this.writeTag(this.keys.primaryColor, color.name)
      .map(() => color);
  }

  public getSessionTimeout(): Observable<number> {
    return this.readTag(this.keys.sessionTimeout)
      .map(timeout => +timeout);
  }

  public setSessionTimeout(timeout: number): Observable<number> {
    return this.writeTag(this.keys.sessionTimeout, timeout.toString())
      .map(() => +timeout);
  }

  public getTimeFormat(): Observable<TimeFormat> {
    return this.readTag(this.keys.timeFormat);
  }

  public setTimeFormat(timeFormat: TimeFormat): Observable<TimeFormat> {
    return this.writeTag(this.keys.timeFormat, timeFormat);
  }

  public removeTimeFormat(): Observable<void> {
    return this.removeTag(this.keys.timeFormat);
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
