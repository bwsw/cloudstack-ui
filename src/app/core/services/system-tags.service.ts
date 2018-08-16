import { Injectable } from '@angular/core';

import { ConfigService } from '../config/config.service';
import { Tag } from '../../shared/models';
import { userTagKeys } from '../../tags/tag-keys';

@Injectable()
export class SystemTagsService {
  constructor(private configService: ConfigService) {
  }

  public getDefaultUserTags(): Array<Tag> {
      return  [
        {
          key: userTagKeys.askToCreateVM,
          value: `${this.configService.get('askToCreateVM')}`
        },
        {
          key: userTagKeys.askToCreateVolume,
          value: `${(this.configService.get('askToCreateVolume'))}`
        },
        {
          key: userTagKeys.savePasswordForAllVMs,
          value: this.configService.get('savePasswordForAllVMs') === null
            ? null
            : `${this.configService.get('savePasswordForAllVMs')}`
        },
        {
          key: userTagKeys.firstDayOfWeek,
          value: `${this.configService.get('defaultFirstDayOfWeek')}`
        },
        {
          key: userTagKeys.lang,
          value: this.configService.get('defaultInterfaceLanguage')
        },
        {
          key: userTagKeys.lastVMId,
          value: `${this.configService.get('lastVMId')}`
        },
        {
          key: userTagKeys.sessionTimeout,
          value: `${this.configService.get('sessionTimeout')}`
        },
        {
          key: userTagKeys.sidenavVisible,
          value: `${this.configService.get('isSidenavVisible')}`
        },
        {
          key: userTagKeys.showSystemTags,
          value: `${this.configService.get('showSystemTags')}`
        },
        {
          key: userTagKeys.timeFormat,
          value: this.configService.get('defaultTimeFormat')
        },
        {
          key: userTagKeys.theme,
          value: this.configService.get('defaultThemeName')
        },
        {
          key: userTagKeys.navigationOrder,
          value: this.configService.get('navigationOrder')
        }
      ];
    }
}
