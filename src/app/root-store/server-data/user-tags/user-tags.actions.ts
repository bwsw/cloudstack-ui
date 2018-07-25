import { Action } from '@ngrx/store';

import { Tag } from '../../../shared/models/index';
import { DayOfWeek, Language, TimeFormat } from '../../../shared/types/index';


export enum UserTagsActionTypes {
  SetDefaultUserTagsAtStartup = '[App initializer] Set default user tags',
  SetDefaultUserTagsDueToLogout = '[Logout] Set default user tags',

  LoadUserTags = '[Home Page] Load User tags',
  LoadUserTagsSuccess = '[Resource tags API] User tags load success',
  LoadUserTagsError = '[Resource tags API] User tags load error',

  UpdateAskToCreateVM = '[VM offer dialog] Update "csui.user.ask-to-create-vm" tag',
  UpdateAskToCreateVMSuccess = '[Resource tags API] Update "csui.user.ask-to-create-vm" tag success',
  UpdateAskToCreateVMError = '[Resource tags API] Update "csui.user.ask-to-create-vm" tag error',

  UpdateAskToCreateVolume = '[Volume offer dialog] Update "csui.user.ask-to-create-volume" tag',
  UpdateAskToCreateVolumeSuccess = '[Resource tags API] Update "csui.user.ask-to-create-volume" tag success',
  UpdateAskToCreateVolumeError = '[Resource tags API] Update "csui.user.ask-to-create-volume" tag error',

  UpdateSPFAVM = '[Settings Page] Update "csui.user.save-password-for-all-vms" tag',
  UpdateSPFAVMSuccess = '[Resource tags API] Update "csui.user.save-password-for-all-vms" tag success',
  UpdateSPFAVMError = '[Resource tags API] Update "csui.user.save-password-for-all-vms" tag error',

  UpdateFirstDayOfWeek = '[Settings Page] Update "csui.user.first-day-of-week" tag',
  UpdateFirstDayOfWeekSuccess = '[Resource tags API] Update "csui.user.first-day-of-week" tag success',
  UpdateFirstDayOfWeekError = '[Resource tags API] Update "csui.user.first-day-of-week" tag error',

  UpdateInterfaceLanguage = '[Settings Page] Update "csui.user.lang" tag',
  UpdateInterfaceLanguageSuccess = '[Resource tags API] Update "csui.user.lang" tag success',
  UpdateInterfaceLanguageError = '[Resource tags API] Update "csui.user.lang" tag error',

  UpdateLastVMId = '[VM creation] Update "csui.user.last-vm-id" tag',
  UpdateLastVMIdSuccess = '[Resource tags API] Update "csui.user.last-vm-id" tag success',
  UpdateLastVMIdError = '[Resource tags API] Update "csui.user.last-vm-id" tag error',

  UpdateSessionTimeout = '[Settings Page] Update "csui.user.session-timeout" tag',
  UpdateSessionTimeoutSuccess = '[Resource tags API] Update "csui.user.session-timeout" tag success',
  UpdateSessionTimeoutError = '[Resource tags API] Update "csui.user.session-timeout" tag error',

  UpdateShowSystemTags = '[Tags tab] Update "csui.user.show-system-tags" tag',
  UpdateShowSystemTagsSuccess = '[Resource tags API] Update "csui.user.show-system-tags" tag success',
  UpdateShowSystemTagsError = '[Resource tags API] Update "csui.user.show-system-tags" tag error',

  UpdateTimeFormat = '[Settings Page] Update "csui.user.time-format" tag',
  UpdateTimeFormatSuccess = '[Resource tags API] Update "csui.user.time-format" tag success',
  UpdateTimeFormatError = '[Resource tags API] Update "csui.user.time-format" tag error',

  UpdateTheme = '[Settings Page] Update "csui.user.theme" tag',
  UpdateThemeSuccess = '[Resource tags API] Update "csui.user.theme" tag success',
  UpdateThemeError = '[Resource tags API] Update "csui.user.theme" tag error',

  UpdateNavigationOrder = '[Menu] Update "csui.user.navigation-order" tag',
  UpdateNavigationOrderSuccess = '[Resource tags API] Update "csui.user.navigation-order" tag success',
  UpdateNavigationOrderError = '[Resource tags API] Update "csui.user.navigation-order" tag error',

  SetSPFAVM = '[Dialog] Set "csui.user.save-password-for-all-vms" tag',
  SetSPFAVMSuccess = '[Resource tags API] Set "csui.user.save-password-for-all-vms" tag success',
  SetSPFAVMError = '[Resource tags API] Set "csui.user.save-password-for-all-vms" tag error',

  IncrementLastVMId = '[VM creation] Increment "csui.user.last-vm-id" tag',
  IncrementLastVMIdSuccess = '[Resource tags API] Increment "csui.user.last-vm-id" tag success',
  IncrementLastVMIdError = '[Resource tags API] Increment "csui.user.last-vm-id" tag error',
}

// We need SetDefaultUserTags actions to set values from default and user configs
// which available after store initialization, so we can not initialize them in the initialState for the reducer
export class SetDefaultUserTagsAtStartup implements Action {
  readonly type = UserTagsActionTypes.SetDefaultUserTagsAtStartup;

  constructor(public payload: { tags: Tag[] }) {
  }
}

export class SetDefaultUserTagsDueToLogout {
  readonly type = UserTagsActionTypes.SetDefaultUserTagsDueToLogout;

  constructor(public payload: { tags: Tag[] }) {
  }
}

export class LoadUserTags implements Action {
  readonly type = UserTagsActionTypes.LoadUserTags;
}

export class LoadUserTagsSuccess implements Action {
  readonly type = UserTagsActionTypes.LoadUserTagsSuccess;

  constructor(public payload: { tags: Tag[] }) {
  }
}

export class LoadUserTagsError implements Action {
  readonly type = UserTagsActionTypes.LoadUserTagsError;

  constructor(public payload: { error: Error }) {
  }
}

// Ask to create VM

export class UpdateAskToCreateVM implements Action {
  readonly type = UserTagsActionTypes.UpdateAskToCreateVM;

  constructor(public payload: { value: boolean }) {
  }
}

export class UpdateAskToCreateVMSuccess implements Action {
  readonly type = UserTagsActionTypes.UpdateAskToCreateVMSuccess;

  constructor(public payload: { key: string, value: string }) {
  }
}

export class UpdateAskToCreateVMError implements Action {
  readonly type = UserTagsActionTypes.UpdateAskToCreateVMError;

  constructor(public payload: { error: Error }) {
  }
}

// Ask to create volume

export class UpdateAskToCreateVolume implements Action {
  readonly type = UserTagsActionTypes.UpdateAskToCreateVolume;

  constructor(public payload: { value: boolean }) {
  }
}

export class UpdateAskToCreateVolumeSuccess implements Action {
  readonly type = UserTagsActionTypes.UpdateAskToCreateVolumeSuccess;

  constructor(public payload: { key: string, value: string }) {
  }
}

export class UpdateAskToCreateVolumeError implements Action {
  readonly type = UserTagsActionTypes.UpdateAskToCreateVolumeError;

  constructor(public payload: { error: Error }) {
  }
}

// Save password for all VMs

export class UpdateSavePasswordForAllVMs implements Action {
  readonly type = UserTagsActionTypes.UpdateSPFAVM;

  constructor(public payload: { value: boolean }) {
  }
}

export class UpdateSavePasswordForAllVMsSuccess implements Action {
  readonly type = UserTagsActionTypes.UpdateSPFAVMSuccess;

  constructor(public payload: { key: string, value: string }) {
  }
}

export class UpdateSavePasswordForAllVMsError implements Action {
  readonly type = UserTagsActionTypes.UpdateSPFAVMError;

  constructor(public payload: { error: Error }) {
  }
}

// First day of week

export class UpdateFirstDayOfWeek implements Action {
  readonly type = UserTagsActionTypes.UpdateFirstDayOfWeek;

  constructor(public payload: { value: DayOfWeek }) {
  }
}

export class UpdateFirstDayOfWeekSuccess implements Action {
  readonly type = UserTagsActionTypes.UpdateFirstDayOfWeekSuccess;

  constructor(public payload: { key: string, value: string }) {
  }
}

export class UpdateFirstDayOfWeekError implements Action {
  readonly type = UserTagsActionTypes.UpdateFirstDayOfWeekError;

  constructor(public payload: { error: Error }) {
  }
}

// Interface language

export class UpdateInterfaceLanguage implements Action {
  readonly type = UserTagsActionTypes.UpdateInterfaceLanguage;

  constructor(public payload: { value: Language }) {
  }
}

export class UpdateInterfaceLanguageSuccess implements Action {
  readonly type = UserTagsActionTypes.UpdateInterfaceLanguageSuccess;

  constructor(public payload: { key: string, value: string }) {
  }
}

export class UpdateInterfaceLanguageError implements Action {
  readonly type = UserTagsActionTypes.UpdateInterfaceLanguageError;

  constructor(public payload: { error: Error }) {
  }
}

// Last VM id

export class UpdateLastVMId implements Action {
  readonly type = UserTagsActionTypes.UpdateLastVMId;

  constructor(public payload: { value: number }) {
  }
}

export class UpdateLastVMIdSuccess implements Action {
  readonly type = UserTagsActionTypes.UpdateLastVMIdSuccess;

  constructor(public payload: { key: string, value: string }) {
  }
}

export class UpdateLastVMIdError implements Action {
  readonly type = UserTagsActionTypes.UpdateLastVMIdError;

  constructor(public payload: { error: Error }) {
  }
}

// Session timeout

export class UpdateSessionTimeout implements Action {
  readonly type = UserTagsActionTypes.UpdateSessionTimeout;

  constructor(public payload: { value: number }) {
  }
}

export class UpdateSessionTimeoutSuccess implements Action {
  readonly type = UserTagsActionTypes.UpdateSessionTimeoutSuccess;

  constructor(public payload: { key: string, value: string }) {
  }
}

export class UpdateSessionTimeoutError implements Action {
  readonly type = UserTagsActionTypes.UpdateSessionTimeoutError;

  constructor(public payload: { error: Error }) {
  }
}

// Show system tags

export class UpdateShowSystemTags implements Action {
  readonly type = UserTagsActionTypes.UpdateShowSystemTags;

  constructor(public payload: { value: boolean }) {
  }
}

export class UpdateShowSystemTagsSuccess implements Action {
  readonly type = UserTagsActionTypes.UpdateShowSystemTagsSuccess;

  constructor(public payload: { key: string, value: string }) {
  }
}

export class UpdateShowSystemTagsError implements Action {
  readonly type = UserTagsActionTypes.UpdateShowSystemTagsError;

  constructor(public payload: { error: Error }) {
  }
}

// Time format

export class UpdateTimeFormat implements Action {
  readonly type = UserTagsActionTypes.UpdateTimeFormat;

  constructor(public payload: { value: TimeFormat }) {
  }
}

export class UpdateTimeFormatSuccess implements Action {
  readonly type = UserTagsActionTypes.UpdateTimeFormatSuccess;

  constructor(public payload: { key: string, value: string }) {
  }
}

export class UpdateTimeFormatError implements Action {
  readonly type = UserTagsActionTypes.UpdateTimeFormatError;

  constructor(public payload: { error: Error }) {
  }
}

// Theme

export class UpdateTheme implements Action {
  readonly type = UserTagsActionTypes.UpdateTheme;

  constructor(public payload: { value: string }) {
  }
}

export class UpdateThemeSuccess implements Action {
  readonly type = UserTagsActionTypes.UpdateThemeSuccess;

  constructor(public payload: { key: string, value: string }) {
  }
}

export class UpdateThemeError implements Action {
  readonly type = UserTagsActionTypes.UpdateThemeError;

  constructor(public payload: { error: Error }) {
  }
}

// Navigation order

export class UpdateNavigationOrder implements Action {
  readonly type = UserTagsActionTypes.UpdateNavigationOrder;

  constructor(public payload: { value: string }) {
  }
}

export class UpdateNavigationOrderSuccess implements Action {
  readonly type = UserTagsActionTypes.UpdateNavigationOrderSuccess;

  constructor(public payload: { key: string, value: string }) {
  }
}

export class UpdateNavigationOrderError implements Action {
  readonly type = UserTagsActionTypes.UpdateNavigationOrderError;

  constructor(public payload: { error: Error }) {
  }
}

// Save password for all VMs

export class SetSavePasswordForAllVMs implements Action {
  readonly type = UserTagsActionTypes.SetSPFAVM;

  constructor(public payload: { value: boolean }) {
  }
}

export class SetSavePasswordForAllVMsSuccess implements Action {
  readonly type = UserTagsActionTypes.SetSPFAVMSuccess;

  constructor(public payload: { key: string, value: string }) {
  }
}

export class SetSavePasswordForAllVMsError implements Action {
  readonly type = UserTagsActionTypes.SetSPFAVMError;

  constructor(public payload: { error: Error }) {
  }
}

// Increment last vm id

export class IncrementLastVMId implements Action {
  readonly type = UserTagsActionTypes.IncrementLastVMId;
}

export class IncrementLastVMIdSuccess implements Action {
  readonly type = UserTagsActionTypes.IncrementLastVMIdSuccess;

  constructor(public payload: { key: string, value: string }) {
  }
}

export class IncrementLastVMIdError implements Action {
  readonly type = UserTagsActionTypes.IncrementLastVMIdError;

  constructor(public payload: { error: Error }) {
  }
}

export type UserTagsActionsUnion =
  | SetDefaultUserTagsAtStartup
  | SetDefaultUserTagsDueToLogout
  | LoadUserTags
  | LoadUserTagsSuccess
  | LoadUserTagsError
  | UpdateAskToCreateVM
  | UpdateAskToCreateVMSuccess
  | UpdateAskToCreateVMError
  | UpdateAskToCreateVolume
  | UpdateAskToCreateVolumeSuccess
  | UpdateAskToCreateVolumeError
  | UpdateSavePasswordForAllVMs
  | UpdateSavePasswordForAllVMsSuccess
  | UpdateSavePasswordForAllVMsError
  | UpdateFirstDayOfWeek
  | UpdateFirstDayOfWeekSuccess
  | UpdateFirstDayOfWeekError
  | UpdateInterfaceLanguage
  | UpdateInterfaceLanguageSuccess
  | UpdateInterfaceLanguageError
  | UpdateLastVMId
  | UpdateLastVMIdSuccess
  | UpdateLastVMIdError
  | UpdateSessionTimeout
  | UpdateSessionTimeoutSuccess
  | UpdateSessionTimeoutError
  | UpdateShowSystemTags
  | UpdateShowSystemTagsSuccess
  | UpdateShowSystemTagsError
  | UpdateTimeFormat
  | UpdateTimeFormatSuccess
  | UpdateTimeFormatError
  | UpdateTheme
  | UpdateThemeSuccess
  | UpdateThemeError
  | UpdateNavigationOrder
  | UpdateNavigationOrderSuccess
  | UpdateNavigationOrderError
  | SetSavePasswordForAllVMs
  | SetSavePasswordForAllVMsSuccess
  | SetSavePasswordForAllVMsError
  | IncrementLastVMId
  | IncrementLastVMIdSuccess
  | IncrementLastVMIdError;
