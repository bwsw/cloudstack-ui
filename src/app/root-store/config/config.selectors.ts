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
          { key: userTagKeys.askToCreateVM, value: `${config.askToCreateVM}` },
          { key: userTagKeys.askToCreateVolume, value: `${config.askToCreateVolume}` },
          {
            key: userTagKeys.savePasswordForAllVMs,
            value: config.savePasswordForAllVMs === null ? null : `${config.savePasswordForAllVMs}`,
          },
          { key: userTagKeys.firstDayOfWeek, value: `${config.defaultFirstDayOfWeek}` },
          { key: userTagKeys.lang, value: config.defaultInterfaceLanguage },
          { key: userTagKeys.lastVMId, value: `${config.lastVMId}` },
          { key: userTagKeys.sessionTimeout, value: `${config.sessionTimeout}` },
          { key: userTagKeys.showSystemTags, value: `${config.showSystemTags}` },
          { key: userTagKeys.timeFormat, value: config.defaultTimeFormat },
          { key: userTagKeys.theme, value: config.defaultTheme },
          { key: userTagKeys.keyboardLayoutForVms, value: config.keyboardLayoutForVms },
        ]
      : [];
  },
);
