import { Injectable } from '@angular/core';
import { EntityTagService } from './entity-tag.service';
import { TagService } from './tag.service';
import { Observable } from 'rxjs/Observable';
import { ResourceTypes } from '../../models/tag.model';
import { StorageService } from '../storage.service';
import { Color } from '../../models/color.model';
import { Utils } from '../utils.service';
import { DayOfWeek } from '../../types/day-of-week';
import { Language, TimeFormat } from '../language.service';


type UserTagKey =
  'accent-color' |
  'ask-to-create-vm' |
  'ask-to-create-volume' |
  'first-day-of-week' |
  'lang' |
  'last-vm-id' |
  'primary-color' |
  'session-timeout' |
  'time-format';

interface UserIdObject {
  id: string;
}

@Injectable()
export class UserTagService extends EntityTagService {
  public entityPrefix = 'User';
  public keys = {
    accentColor: 'accent-color' as UserTagKey,
    askToCreateVm: 'ask-to-create-vm' as UserTagKey,
    askToCreateVolume: 'ask-to-create-volume' as UserTagKey,
    firstDayOfWeek: 'first-day-of-week' as UserTagKey,
    lang: 'lang' as UserTagKey,
    lastVmId: 'last-vm-id' as UserTagKey,
    primaryColor: 'primary-color' as UserTagKey,
    sessionTimeout: 'session-timeout' as UserTagKey,
    timeFormat: 'time-format' as UserTagKey
  };

  constructor(
    private storageService: StorageService,
    protected tagService: TagService
  ) {
    super(tagService);
  }

  private get user(): UserIdObject {
    const id = this.storageService.read('userId');
    return id ? { id } : undefined;
  }

  public getAccentColor(): Observable<string> {
    return this.readTag(this.keys.accentColor);
  }

  public setAccentColor(color: Color): Observable<void> {
    return this.writeTag(this.keys.accentColor, color.name);
  }

  public getAskToCreateVm(): Observable<boolean> {
    return this.readTag(this.keys.askToCreateVm)
      .map(value => Utils.convertBooleanStringToBoolean(value));
  }

  public setAskToCreateVm(ask: boolean): Observable<void> {
    return this.writeTag(
      this.keys.askToCreateVm,
      Utils.convertBooleanToBooleanString(ask)
    );
  }

  public getAskToCreateVolume(): Observable<boolean> {
    return this.readTag(this.keys.askToCreateVolume)
      .map(value => Utils.convertBooleanStringToBoolean(value));
  }

  public setAskToCreateVolume(ask: boolean): Observable<void> {
    return this.writeTag(
      this.keys.askToCreateVolume,
      Utils.convertBooleanToBooleanString(ask)
    );
  }

  public getFirstDayOfWeek(): Observable<DayOfWeek> {
    return this.readTag(this.keys.firstDayOfWeek).map(value => +value);
  }

  public setFirstDayOfWeek(dayOfWeek: DayOfWeek): Observable<void> {
    return this.writeTag(this.keys.firstDayOfWeek, dayOfWeek.toString());
  }

  public getLang(): Observable<Language> {
    return this.readTag(this.keys.lang);
  }

  public setLang(language: Language): Observable<void> {
    return this.writeTag(this.keys.lang, language);
  }

  public getLastVmId(): Observable<string> {
    return this.readTag(this.keys.lastVmId);
  }

  public setLastVmId(id: string): Observable<void> {
    return this.writeTag(this.keys.lastVmId, id);
  }

  public getPrimaryColor(): Observable<string> {
    return this.readTag(this.keys.primaryColor);
  }

  public setPrimaryColor(color: Color): Observable<void> {
    return this.writeTag(this.keys.primaryColor, color.name);
  }

  public getSessionTimeout(): Observable<number> {
    return this.readTag(this.keys.sessionTimeout)
      .map(timeout => +timeout);
  }

  public setSessionTimeout(timeout: number): Observable<void> {
    return this.writeTag(this.keys.sessionTimeout, timeout.toString());
  }

  public getTimeFormat(): Observable<TimeFormat> {
    return this.readTag(this.keys.timeFormat);
  }

  public setTimeFormat(timeFormat: TimeFormat): Observable<void> {
    return this.writeTag(this.keys.timeFormat, timeFormat);
  }

  public writeTag(key: string, value: string): Observable<void> {
    const user = this.user;

    if (user) {
      return this.tagService.update(user, 'User', key, value);
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
