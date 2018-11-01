import { createSelector } from '@ngrx/store';

import { SettingsViewModel } from '../view-models';
import * as userTags from '../../root-store/server-data/user-tags/user-tags.selectors';

const getVmLogsSettings = createSelector(
  userTags.getVmLogsShowLastMessages,
  userTags.getVmLogsShowLastMinutes,
  (vmLogsShowLastMessages, vmLogsShowLastMinutes) => ({
    vmLogsShowLastMessages,
    vmLogsShowLastMinutes,
  }),
);

export const getSettingsViewModel = createSelector(
  userTags.getSessionTimeout,
  userTags.getIsSavePasswordForVMs,
  userTags.getInterfaceLanguage,
  userTags.getFirstDayOfWeek,
  userTags.getTimeFormat,
  userTags.getTheme,
  userTags.getKeyboardLayout,
  getVmLogsSettings,
  (
    sessionTimeout,
    isSavePasswordForVMs,
    interfaceLanguage,
    firstDayOfWeek,
    timeFormat,
    theme,
    keyboardLayout,
    { vmLogsShowLastMessages, vmLogsShowLastMinutes },
  ): SettingsViewModel => {
    return {
      sessionTimeout,
      isSavePasswordForVMs,
      interfaceLanguage,
      firstDayOfWeek,
      timeFormat,
      theme,
      keyboardLayout,
      vmLogsShowLastMessages,
      vmLogsShowLastMinutes,
    };
  },
);
