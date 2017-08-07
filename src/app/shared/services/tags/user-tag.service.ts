import { Injectable } from '@angular/core';
import { EntityTagService } from './entity-tag.service';
import { UserService } from '../user.service';
import { TagService } from './tag.service';


type UserTagKey = 'a';

@Injectable()
export class UserTagService extends EntityTagService {
  public entityPrefix = 'User';
  public keys = {
    accentColor: 'accent-color' as UserTagKey,
    askToCreateVm: 'ask-to-create-vm' as UserTagKey,
    askToCreateVolume: 'ask-to-create-volume' as UserTagKey,
    firstDayOfWeek: 'first-day-of-week' as UserTagKey,
    lang: 'lang' as UserTagKey,
    numberOfVms: 'number-of-vms' as UserTagKey,
    primaryColor: 'primary-color' as UserTagKey,
    sessionTimeout: 'session-timeout' as UserTagKey,
    timeFormat: 'time-format' as UserTagKey
  };

  constructor(
    protected tagService: TagService,
    private userService: UserService
  ) {
    super(tagService);
  }

  public getAccentColor() {

  }

  public setAccentColor() {

  }

  public getAskToCreateVm() {

  }

  public setAskToCreateVm() {

  }

  public getAskToCreateVolume() {

  }

  public setAskToCreateVolume() {

  }

  public getFirstDayOfWeek() {

  }

  public setFirstDayOfWeek() {

  }

  public getLang() {

  }

  public setLang() {

  }

  public getNumberOfVms() {

  }

  public setNumberOfVms() {

  }

  public getPrimaryColor() {

  }

  public setPrimaryColor() {

  }

  public getSessionTimeout() {

  }

  public setSessionTimeout() {

  }

  public getTimeFormat() {

  }

  public setTimeFormat() {

  }
}
