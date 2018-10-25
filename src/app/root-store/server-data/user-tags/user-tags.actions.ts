import { Action } from '@ngrx/store';

import { ServiceOffering, Tag } from '../../../shared/models';
import { DayOfWeek, Language, TimeFormat } from '../../../shared/types';

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

  UpdateKeyboardLayoutForVms = '[Settings Page] Update "csui.user.vm-keyboard-layout" tag',
  UpdateKeyboardLayoutForVmsSuccess = '[Resource tags API] Update "csui.user.vm-keyboard-layout" tag success',
  UpdateKeyboardLayoutForVmsError = '[Resource tags API] Update "csui.user.vm-keyboard-layout" tag error',

  SetSPFAVM = '[Dialog] Set "csui.user.save-password-for-all-vms" tag',
  SetSPFAVMSuccess = '[Resource tags API] Set "csui.user.save-password-for-all-vms" tag success',
  SetSPFAVMError = '[Resource tags API] Set "csui.user.save-password-for-all-vms" tag error',

  IncrementLastVMId = '[VM creation] Increment "csui.user.last-vm-id" tag',
  IncrementLastVMIdSuccess = '[Resource tags API] Increment "csui.user.last-vm-id" tag success',
  IncrementLastVMIdError = '[Resource tags API] Increment "csui.user.last-vm-id" tag error',

  UpdateCustomServiceOfferingParams = '[VM creation] Set "csui.user.service-offering.param" tag',
}

// We need SetDefaultUserTags actions to set values from default and user configs
// which available after store initialization, so we can not initialize them in the initialState for the reducer
export class SetDefaultUserTagsAtStartup implements Action {
  readonly type = UserTagsActionTypes.SetDefaultUserTagsAtStartup;

  constructor(readonly payload: { tags: Tag[] }) {}
}

export class SetDefaultUserTagsDueToLogout {
  readonly type = UserTagsActionTypes.SetDefaultUserTagsDueToLogout;

  constructor(readonly payload: { tags: Tag[] }) {}
}

export class LoadUserTags implements Action {
  readonly type = UserTagsActionTypes.LoadUserTags;
}

export class LoadUserTagsSuccess implements Action {
  readonly type = UserTagsActionTypes.LoadUserTagsSuccess;

  constructor(readonly payload: { tags: Tag[] }) {}
}

export class LoadUserTagsError implements Action {
  readonly type = UserTagsActionTypes.LoadUserTagsError;

  constructor(readonly payload: { error: Error }) {}
}

// Ask to create VM

export class UpdateAskToCreateVM implements Action {
  readonly type = UserTagsActionTypes.UpdateAskToCreateVM;

  constructor(readonly payload: { value: boolean }) {}
}

export class UpdateAskToCreateVMSuccess implements Action {
  readonly type = UserTagsActionTypes.UpdateAskToCreateVMSuccess;

  constructor(readonly payload: { key: string; value: string }) {}
}

export class UpdateAskToCreateVMError implements Action {
  readonly type = UserTagsActionTypes.UpdateAskToCreateVMError;

  constructor(readonly payload: { error: Error }) {}
}

// Ask to create volume

export class UpdateAskToCreateVolume implements Action {
  readonly type = UserTagsActionTypes.UpdateAskToCreateVolume;

  constructor(readonly payload: { value: boolean }) {}
}

export class UpdateAskToCreateVolumeSuccess implements Action {
  readonly type = UserTagsActionTypes.UpdateAskToCreateVolumeSuccess;

  constructor(readonly payload: { key: string; value: string }) {}
}

export class UpdateAskToCreateVolumeError implements Action {
  readonly type = UserTagsActionTypes.UpdateAskToCreateVolumeError;

  constructor(readonly payload: { error: Error }) {}
}

// Save password for all VMs

export class UpdateSavePasswordForAllVMs implements Action {
  readonly type = UserTagsActionTypes.UpdateSPFAVM;

  constructor(readonly payload: { value: boolean }) {}
}

export class UpdateSavePasswordForAllVMsSuccess implements Action {
  readonly type = UserTagsActionTypes.UpdateSPFAVMSuccess;

  constructor(readonly payload: { key: string; value: string }) {}
}

export class UpdateSavePasswordForAllVMsError implements Action {
  readonly type = UserTagsActionTypes.UpdateSPFAVMError;

  constructor(readonly payload: { error: Error }) {}
}

// First day of week

export class UpdateFirstDayOfWeek implements Action {
  readonly type = UserTagsActionTypes.UpdateFirstDayOfWeek;

  constructor(readonly payload: { value: DayOfWeek }) {}
}

export class UpdateFirstDayOfWeekSuccess implements Action {
  readonly type = UserTagsActionTypes.UpdateFirstDayOfWeekSuccess;

  constructor(readonly payload: { key: string; value: string }) {}
}

export class UpdateFirstDayOfWeekError implements Action {
  readonly type = UserTagsActionTypes.UpdateFirstDayOfWeekError;

  constructor(readonly payload: { error: Error }) {}
}

// Interface language

export class UpdateInterfaceLanguage implements Action {
  readonly type = UserTagsActionTypes.UpdateInterfaceLanguage;

  constructor(readonly payload: { value: Language }) {}
}

export class UpdateInterfaceLanguageSuccess implements Action {
  readonly type = UserTagsActionTypes.UpdateInterfaceLanguageSuccess;

  constructor(readonly payload: { key: string; value: string }) {}
}

export class UpdateInterfaceLanguageError implements Action {
  readonly type = UserTagsActionTypes.UpdateInterfaceLanguageError;

  constructor(readonly payload: { error: Error }) {}
}

// Last VM id

export class UpdateLastVMId implements Action {
  readonly type = UserTagsActionTypes.UpdateLastVMId;

  constructor(readonly payload: { value: number }) {}
}

export class UpdateLastVMIdSuccess implements Action {
  readonly type = UserTagsActionTypes.UpdateLastVMIdSuccess;

  constructor(readonly payload: { key: string; value: string }) {}
}

export class UpdateLastVMIdError implements Action {
  readonly type = UserTagsActionTypes.UpdateLastVMIdError;

  constructor(readonly payload: { error: Error }) {}
}

// Session timeout

export class UpdateSessionTimeout implements Action {
  readonly type = UserTagsActionTypes.UpdateSessionTimeout;

  constructor(readonly payload: { value: number }) {}
}

export class UpdateSessionTimeoutSuccess implements Action {
  readonly type = UserTagsActionTypes.UpdateSessionTimeoutSuccess;

  constructor(readonly payload: { key: string; value: string }) {}
}

export class UpdateSessionTimeoutError implements Action {
  readonly type = UserTagsActionTypes.UpdateSessionTimeoutError;

  constructor(readonly payload: { error: Error }) {}
}

// Show system tags

export class UpdateShowSystemTags implements Action {
  readonly type = UserTagsActionTypes.UpdateShowSystemTags;

  constructor(readonly payload: { value: boolean }) {}
}

export class UpdateShowSystemTagsSuccess implements Action {
  readonly type = UserTagsActionTypes.UpdateShowSystemTagsSuccess;

  constructor(readonly payload: { key: string; value: string }) {}
}

export class UpdateShowSystemTagsError implements Action {
  readonly type = UserTagsActionTypes.UpdateShowSystemTagsError;

  constructor(readonly payload: { error: Error }) {}
}

// Time format

export class UpdateTimeFormat implements Action {
  readonly type = UserTagsActionTypes.UpdateTimeFormat;

  constructor(readonly payload: { value: TimeFormat }) {}
}

export class UpdateTimeFormatSuccess implements Action {
  readonly type = UserTagsActionTypes.UpdateTimeFormatSuccess;

  constructor(readonly payload: { key: string; value: string }) {}
}

export class UpdateTimeFormatError implements Action {
  readonly type = UserTagsActionTypes.UpdateTimeFormatError;

  constructor(readonly payload: { error: Error }) {}
}

// Theme

export class UpdateTheme implements Action {
  readonly type = UserTagsActionTypes.UpdateTheme;

  constructor(readonly payload: { value: string }) {}
}

export class UpdateThemeSuccess implements Action {
  readonly type = UserTagsActionTypes.UpdateThemeSuccess;

  constructor(readonly payload: { key: string; value: string }) {}
}

export class UpdateThemeError implements Action {
  readonly type = UserTagsActionTypes.UpdateThemeError;

  constructor(readonly payload: { error: Error }) {}
}

// Keyboard

export class UpdateKeyboardLayoutForVms implements Action {
  readonly type = UserTagsActionTypes.UpdateKeyboardLayoutForVms;

  constructor(readonly payload: { value: string }) {}
}

export class UpdateKeyboardLayoutForVmsSuccess implements Action {
  readonly type = UserTagsActionTypes.UpdateKeyboardLayoutForVmsSuccess;

  constructor(readonly payload: { key: string; value: string }) {}
}

export class UpdateKeyboardLayoutForVmsError implements Action {
  readonly type = UserTagsActionTypes.UpdateKeyboardLayoutForVmsError;

  constructor(readonly payload: { error: Error }) {}
}

// Save password for all VMs

export class SetSavePasswordForAllVMs implements Action {
  readonly type = UserTagsActionTypes.SetSPFAVM;

  constructor(readonly payload: { value: boolean }) {}
}

export class SetSavePasswordForAllVMsSuccess implements Action {
  readonly type = UserTagsActionTypes.SetSPFAVMSuccess;

  constructor(readonly payload: { key: string; value: string }) {}
}

export class SetSavePasswordForAllVMsError implements Action {
  readonly type = UserTagsActionTypes.SetSPFAVMError;

  constructor(readonly payload: { error: Error }) {}
}

// Increment last vm id

export class IncrementLastVMId implements Action {
  readonly type = UserTagsActionTypes.IncrementLastVMId;
}

export class IncrementLastVMIdSuccess implements Action {
  readonly type = UserTagsActionTypes.IncrementLastVMIdSuccess;

  constructor(readonly payload: { key: string; value: string }) {}
}

export class IncrementLastVMIdError implements Action {
  readonly type = UserTagsActionTypes.IncrementLastVMIdError;

  constructor(readonly payload: { error: Error }) {}
}

export class UpdateCustomServiceOfferingParams implements Action {
  readonly type = UserTagsActionTypes.UpdateCustomServiceOfferingParams;

  constructor(readonly payload: { offering: ServiceOffering }) {}
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
  | UpdateKeyboardLayoutForVms
  | UpdateKeyboardLayoutForVmsSuccess
  | UpdateKeyboardLayoutForVmsError
  | SetSavePasswordForAllVMs
  | SetSavePasswordForAllVMsSuccess
  | SetSavePasswordForAllVMsError
  | IncrementLastVMId
  | IncrementLastVMIdSuccess
  | IncrementLastVMIdError
  | UpdateCustomServiceOfferingParams;
