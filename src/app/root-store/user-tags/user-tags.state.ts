import { userTagKeys } from './user-tag-keys';
import { AppConfiguration } from '../../shared/classes/app-configuration';
import { Tag } from '../../shared/models';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

export interface UserTagsState {
  isLoading: boolean;
  ids: string[];
  entities: { [id: string]: Tag };
}

export interface UserTagsState extends EntityState<Tag> {
  isLoading: boolean;
}

export const adapter: EntityAdapter<Tag> = createEntityAdapter<Tag>({
  selectId: (tag: Tag) => tag.key
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
  userTagKeys.navigationOrder
];

const initialEntities = {
  [userTagKeys.askToCreateVM]: {
    key: userTagKeys.askToCreateVM,
    value: AppConfiguration.askToCreateVM.toString()
  },
  [userTagKeys.askToCreateVolume]: {
    key: userTagKeys.askToCreateVolume,
    value: AppConfiguration.askToCreateVolume.toString()
  },
  [userTagKeys.savePasswordForAllVMs]: {
    key: userTagKeys.savePasswordForAllVMs,
    value: AppConfiguration.savePasswordForAllVMs === null ? null : AppConfiguration.savePasswordForAllVMs.toString()
  },
  [userTagKeys.firstDayOfWeek]: {
    key: userTagKeys.firstDayOfWeek,
    value: AppConfiguration.firstDayOfWeek
  },
  [userTagKeys.lang]: {
    key: userTagKeys.lang,
    value: AppConfiguration.interfaceLanguage
  },
  [userTagKeys.lastVMId]: {
    key: userTagKeys.lastVMId,
    value: AppConfiguration.lastVMId.toString()
  },
  [userTagKeys.sessionTimeout]: {
    key: userTagKeys.sessionTimeout,
    value: AppConfiguration.sessionTimeout.toString()
  },
  [userTagKeys.showSystemTags]: {
    key: userTagKeys.showSystemTags,
    value: AppConfiguration.showSystemTags.toString()
  },
  [userTagKeys.timeFormat]: {
    key: userTagKeys.timeFormat,
    value: AppConfiguration.timeFormat
  },
  [userTagKeys.theme]: {
    key: userTagKeys.theme,
    value: AppConfiguration.theme
  },
  [userTagKeys.navigationOrder]: {
    key: userTagKeys.navigationOrder,
    value: AppConfiguration.navigationOrder
  }
};

export const initialState: UserTagsState = adapter.getInitialState({
  isLoading: false,
  ids: initialIds,
  entities: initialEntities
});
