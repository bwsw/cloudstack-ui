import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { userTagKeys } from '../../../tags/tag-keys';
import { defaultConfig } from '../../../core/config';
import { Tag } from '../../../shared/models';

export interface UserTagsState {
  isLoading: boolean;
  ids: string[];
  entities: { [id: string]: Tag };
}

export interface UserTagsState extends EntityState<Tag> {
  isLoading: boolean;
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
];

const initialEntities = {
  [userTagKeys.askToCreateVM]: {
    key: userTagKeys.askToCreateVM,
    value: defaultConfig.askToCreateVM.toString(),
  },
  [userTagKeys.askToCreateVolume]: {
    key: userTagKeys.askToCreateVolume,
    value: defaultConfig.askToCreateVolume.toString(),
  },
  [userTagKeys.savePasswordForAllVMs]: {
    key: userTagKeys.savePasswordForAllVMs,
    value:
      defaultConfig.savePasswordForAllVMs === null
        ? null
        : defaultConfig.savePasswordForAllVMs.toString(),
  },
  [userTagKeys.firstDayOfWeek]: {
    key: userTagKeys.firstDayOfWeek,
    value: defaultConfig.defaultFirstDayOfWeek.toString(),
  },
  [userTagKeys.lang]: {
    key: userTagKeys.lang,
    value: defaultConfig.defaultInterfaceLanguage,
  },
  [userTagKeys.lastVMId]: {
    key: userTagKeys.lastVMId,
    value: defaultConfig.lastVMId.toString(),
  },
  [userTagKeys.sessionTimeout]: {
    key: userTagKeys.sessionTimeout,
    value: defaultConfig.sessionTimeout.toString(),
  },
  [userTagKeys.showSystemTags]: {
    key: userTagKeys.showSystemTags,
    value: defaultConfig.showSystemTags.toString(),
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
};

export const initialState: UserTagsState = adapter.getInitialState({
  isLoading: false,
  ids: initialIds,
  entities: initialEntities,
});
