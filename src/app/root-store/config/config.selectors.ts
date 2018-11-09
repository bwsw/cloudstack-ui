import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ConfigState } from './config.reducer';
import { Config, Tag } from '../../shared/models';
import { userTagKeys } from '../../tags/tag-keys';

const getConfigState = createFeatureSelector<ConfigState>('config');

export const isLoaded = createSelector(getConfigState, (state: ConfigState) => state.isLoaded);

export const get = <T extends keyof Config>(key: T) =>
  createSelector(getConfigState, (state: ConfigState): Config[T] => state.config[key as string]);

export const getDefaultUserTags = createSelector(
  getConfigState,
  (state: ConfigState): Tag[] => {
    const config = state.config;
    return config
      ? [
          { key: userTagKeys.askToCreateVM, value: String(config.askToCreateVM) },
          { key: userTagKeys.askToCreateVolume, value: String(config.askToCreateVolume) },
          {
            key: userTagKeys.savePasswordForAllVMs,
            value:
              config.savePasswordForAllVMs === null ? null : String(config.savePasswordForAllVMs),
          },
          { key: userTagKeys.firstDayOfWeek, value: String(config.defaultFirstDayOfWeek) },
          { key: userTagKeys.lang, value: config.defaultInterfaceLanguage },
          { key: userTagKeys.lastVMId, value: String(config.lastVMId) },
          { key: userTagKeys.sessionTimeout, value: String(config.sessionTimeout) },
          { key: userTagKeys.showSystemTags, value: String(config.showSystemTags) },
          { key: userTagKeys.timeFormat, value: config.defaultTimeFormat },
          { key: userTagKeys.theme, value: config.defaultTheme },
          { key: userTagKeys.keyboardLayoutForVms, value: config.keyboardLayoutForVms },
          { key: userTagKeys.sidebarWidth, value: String(config.sidebarWidth) },
        ]
      : [];
  },
);
