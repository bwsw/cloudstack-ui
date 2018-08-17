import { createFeatureSelector, createSelector } from '@ngrx/store';

import { adapter, UserTagsState } from './user-tags.state';
import { userTagKeys } from '../../../tags/tag-keys';
import { DayOfWeek, Language, TimeFormat } from '../../../shared/types';

function convertToBoolean(input: string): boolean {
  try {
    return JSON.parse(input);
  } catch (e) {
    return false;
  }
}

const getUserTagsState = createFeatureSelector<UserTagsState>('userTags');

export const getIsLoading = createSelector(
  getUserTagsState,
  (state: UserTagsState) => state.isLoading
);

const { selectEntities: getUserTagsEntities } = adapter.getSelectors(getUserTagsState);

// Selectors based on supported tags
// https://github.com/bwsw/cloudstack-ui/wiki/Tags

export const getIsAskToCreateVM = createSelector(
  getUserTagsEntities,
  (entities): boolean => {
    const value = entities[userTagKeys.askToCreateVM].value;
    return convertToBoolean(value);
  }
);

export const getIsAskToCreateVolume = createSelector(
  getUserTagsEntities,
  (entities): boolean => {
    const value = entities[userTagKeys.askToCreateVolume].value;
    return convertToBoolean(value);
  }
);

export const getIsSavePasswordForVMs = createSelector(
  getUserTagsEntities,
  (entities): boolean | null => {
    const value = entities[userTagKeys.savePasswordForAllVMs].value;
    return convertToBoolean(value);
  }
);

export const getFirstDayOfWeek = createSelector(
  getUserTagsEntities,
  (entities): DayOfWeek => +entities[userTagKeys.firstDayOfWeek].value as DayOfWeek
);

export const getInterfaceLanguage = createSelector(
  getUserTagsEntities,
  (entities): Language => entities[userTagKeys.lang].value as Language
);

export const getLastVMId = createSelector(
  getUserTagsEntities,
  (entities): number => +entities[userTagKeys.lastVMId].value
);

export const getSessionTimeout = createSelector(
  getUserTagsEntities,
  (entities): number => +entities[userTagKeys.sessionTimeout].value
);

export const getIsShowSystemTags = createSelector(
  getUserTagsEntities,
  (entities): boolean => {
    const value = entities[userTagKeys.showSystemTags].value;
    return convertToBoolean(value);
  }
);

export const isSidenavVisible = createSelector(
  getUserTagsEntities,
  (entities): boolean => {
    const value = entities[userTagKeys.sidenavVisible].value;
    return convertToBoolean(value);
  }
);

export const getTimeFormat = createSelector(
  getUserTagsEntities,
  (entities): TimeFormat => entities[userTagKeys.timeFormat].value as TimeFormat
);

export const getTheme = createSelector(
  getUserTagsEntities,
  (entities): string => entities[userTagKeys.theme].value
);

export const getNavigationOrder = createSelector(
  getUserTagsEntities,
  (entities): string => entities[userTagKeys.navigationOrder].value
);
