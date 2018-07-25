import { Injectable } from '@angular/core';

import { ConfigService } from './config.service';
import { Tag } from '../../shared/models';
import { userTagKeys } from '../../tags/tag-keys';

function toString(value: boolean | number): string {
  return `${value}`;
}

@Injectable()
export class SystemTagsService {
  constructor(private configService: ConfigService) {
  }

  public getDefaultUserTags(): Array<Tag> {
      return  [
        {
          key: userTagKeys.askToCreateVM,
          value: toString(this.configService.get<boolean>('askToCreateVM'))
        },
        {
          key: userTagKeys.askToCreateVolume,
          value: toString(this.configService.get<boolean>('askToCreateVolume'))
        },
        {
          key: userTagKeys.savePasswordForAllVMs,
          value: this.configService.get<boolean | null>('savePasswordForAllVMs') === null
            ? null
            : toString(this.configService.get<boolean>('savePasswordForAllVMs'))
        },
        {
          key: userTagKeys.firstDayOfWeek,
          value: toString(this.configService.get<number>('defaultFirstDayOfWeek'))
        },
        {
          key: userTagKeys.lang,
          value: this.configService.get<string>('defaultInterfaceLanguage')
        },
        {
          key: userTagKeys.lastVMId,
          value: toString(this.configService.get<number>('lastVMId'))
        },
        {
          key: userTagKeys.sessionTimeout,
          value: toString(this.configService.get<number>('sessionTimeout'))
        },
        {
          key: userTagKeys.showSystemTags,
          value: toString(this.configService.get<boolean>('showSystemTags'))
        },
        {
          key: userTagKeys.timeFormat,
          value: this.configService.get<string>('defaultTimeFormat')
        },
        {
          key: userTagKeys.theme,
          value: this.configService.get<string>('defaultThemeName')
        },
        {
          key: userTagKeys.navigationOrder,
          value: this.configService.get<string>('navigationOrder')
        }
      ];
    }
}
