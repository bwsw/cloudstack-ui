import { createFeatureSelector, createSelector } from '@ngrx/store';

const camelCase = require('lodash/camelCase');
import { adapter, UserTagsState } from './user-tags.state';
import { userTagKeys } from '../../../tags/tag-keys';
import { DayOfWeek, KeyboardLayout, Language, TimeFormat } from '../../../shared/types';
import { Tag } from '../../../shared/models';
import { Serializer } from '../../../shared/utils/serializer';
import { vmLogsFilters } from '../../../vm-logs/vm-logs-filters';

function convertToBoolean(input: string): boolean {
  try {
    return JSON.parse(input);
  } catch (e) {
    return false;
  }
}

const getUserTagsState = createFeatureSelector<UserTagsState>('userTags');

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors(
  getUserTagsState,
);

export const getIsLoaded = createSelector(
  getUserTagsState,
  (state: UserTagsState) => state.isLoaded,
);

const { selectEntities: getUserTagsEntities } = adapter.getSelectors(getUserTagsState);

// Selectors based on supported tags
// https://github.com/bwsw/cloudstack-ui/wiki/Tags

export const getIsAskToCreateVM = createSelector(
  getUserTagsEntities,
  (entities): boolean => {
    const value = entities[userTagKeys.askToCreateVM].value;
    return convertToBoolean(value);
  },
);

export const getIsAskToCreateVolume = createSelector(
  getUserTagsEntities,
  (entities): boolean => {
    const value = entities[userTagKeys.askToCreateVolume].value;
    return convertToBoolean(value);
  },
);

export const getIsSavePasswordForVMs = createSelector(
  getUserTagsEntities,
  (entities): boolean | null => {
    const value = entities[userTagKeys.savePasswordForAllVMs].value;
    return convertToBoolean(value);
  },
);

export const getFirstDayOfWeek = createSelector(
  getUserTagsEntities,
  (entities): DayOfWeek => Number(entities[userTagKeys.firstDayOfWeek].value) as DayOfWeek,
);

export const getInterfaceLanguage = createSelector(
  getUserTagsEntities,
  (entities): Language => entities[userTagKeys.lang].value as Language,
);

export const getLastVMId = createSelector(
  getUserTagsEntities,
  (entities): number => Number(entities[userTagKeys.lastVMId].value),
);

export const getSessionTimeout = createSelector(
  getUserTagsEntities,
  (entities): number => Number(entities[userTagKeys.sessionTimeout].value),
);

export const getIsShowSystemTags = createSelector(
  getUserTagsEntities,
  (entities): boolean => {
    const value = entities[userTagKeys.showSystemTags].value;
    return convertToBoolean(value);
  },
);

export const getTimeFormat = createSelector(
  getUserTagsEntities,
  (entities): TimeFormat => entities[userTagKeys.timeFormat].value as TimeFormat,
);

export const getTheme = createSelector(
  getUserTagsEntities,
  (entities): string => entities[userTagKeys.theme].value,
);

export const getServiceOfferingParamTags = createSelector(
  selectAll,
  (tags): Tag[] => {
    return tags.filter(tag => tag.key.startsWith(userTagKeys.computeOfferingParam));
  },
);

export const getKeyboardLayout = createSelector(
  getUserTagsEntities,
  (entities): KeyboardLayout => entities[userTagKeys.keyboardLayoutForVms].value as KeyboardLayout,
);

export const getVmLogsShowLastMessages = createSelector(
  getUserTagsEntities,
  (entities): number => Number(entities[userTagKeys.vmLogsShowLastMessages].value),
);

export const getVmLogsShowLastMinutes = createSelector(
  getUserTagsEntities,
  (entities): number => Number(entities[userTagKeys.vmLogsShowLastMinutes].value),
);

export const getSidebarWidth = createSelector(
  getUserTagsEntities,
  (entities): number => Number(entities[userTagKeys.sidebarWidth].value),
);

const vmLogsFilterParts = userTagKeys.vmLogsFilter.split('.');
const getVmLogsFilterKey = (tagKey: string) => {
  const parts = tagKey.split('.');
  const isVmLogsFilterKey = vmLogsFilterParts.every((v, i) => parts[i] === v);

  if (!isVmLogsFilterKey) {
    return false;
  }

  return camelCase(parts.pop());
};

export const getVmLogsFilters = createSelector(
  getUserTagsEntities,
  (entities): Object => {
    const params = Object.keys(entities).reduce((acc, key) => {
      const filterKey = getVmLogsFilterKey(key);

      if (!filterKey) {
        return acc;
      }

      return {
        ...acc,
        [filterKey]: entities[key].value,
      };
    }, {});

    return Serializer.decode([params], vmLogsFilters);
  },
);
