import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { userTagKeys } from '../../../tags/tag-keys';
import { defaultConfig } from '../../../core/config';
import { Tag } from '../../../shared/models';

export interface UserTagsState extends EntityState<Tag> {
  isLoaded: boolean;
}

export const adapter: EntityAdapter<Tag> = createEntityAdapter<Tag>({
  selectId: (tag: Tag) => tag.key,
});

const initialIds = [
  userTagKeys.askToCreateVM,
  userTagKeys.askToCreateVolume,
  userTagKeys.savePasswordForAllVMs,
  userTagKeys.firstDayOfWeek,
  userTagKeys.lang,
  userTagKeys.lastVMId,
  userTagKeys.sessionTimeout,
  userTagKeys.showSystemTags,
  userTagKeys.timeFormat,
  userTagKeys.theme,
  userTagKeys.vmLogsShowLastMessages,
  userTagKeys.vmLogsShowLastMinutes,
  userTagKeys.keyboardLayoutForVms,
  userTagKeys.sidebarWidth,
];

const initialEntities = {
  [userTagKeys.askToCreateVM]: {
    key: userTagKeys.askToCreateVM,
    value: String(defaultConfig.askToCreateVM),
  },
  [userTagKeys.askToCreateVolume]: {
    key: userTagKeys.askToCreateVolume,
    value: String(defaultConfig.askToCreateVolume),
  },
  [userTagKeys.savePasswordForAllVMs]: {
    key: userTagKeys.savePasswordForAllVMs,
    value:
      defaultConfig.savePasswordForAllVMs === null
        ? null
        : String(defaultConfig.savePasswordForAllVMs),
  },
  [userTagKeys.firstDayOfWeek]: {
    key: userTagKeys.firstDayOfWeek,
    value: String(defaultConfig.defaultFirstDayOfWeek),
  },
  [userTagKeys.lang]: {
    key: userTagKeys.lang,
    value: defaultConfig.defaultInterfaceLanguage,
  },
  [userTagKeys.lastVMId]: {
    key: userTagKeys.lastVMId,
    value: String(defaultConfig.lastVMId),
  },
  [userTagKeys.sessionTimeout]: {
    key: userTagKeys.sessionTimeout,
    value: String(defaultConfig.sessionTimeout),
  },
  [userTagKeys.showSystemTags]: {
    key: userTagKeys.showSystemTags,
    value: String(defaultConfig.showSystemTags),
  },
  [userTagKeys.timeFormat]: {
    key: userTagKeys.timeFormat,
    value: defaultConfig.defaultTimeFormat,
  },
  [userTagKeys.theme]: {
    key: userTagKeys.theme,
    value: defaultConfig.defaultTheme,
  },
  [userTagKeys.keyboardLayoutForVms]: {
    key: userTagKeys.keyboardLayoutForVms,
    value: defaultConfig.keyboardLayoutForVms,
  },
  [userTagKeys.vmLogsShowLastMessages]: {
    key: userTagKeys.vmLogsShowLastMessages,
    value: String(defaultConfig.vmLogsShowLastMessages),
  },
  [userTagKeys.vmLogsShowLastMinutes]: {
    key: userTagKeys.vmLogsShowLastMinutes,
    value: String(defaultConfig.vmLogsShowLastMinutes),
  },
  [userTagKeys.sidebarWidth]: {
    key: userTagKeys.sidebarWidth,
    value: defaultConfig.sidebarWidth,
  },
};

export const initialState: UserTagsState = adapter.getInitialState({
  isLoaded: false,
  ids: initialIds,
  entities: initialEntities,
});
