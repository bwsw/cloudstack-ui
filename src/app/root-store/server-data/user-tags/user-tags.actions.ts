import { Action } from '@ngrx/store';

import { ServiceOffering, Tag, TagUpdatingParams } from '../../../shared/models';
import { DayOfWeek, Language, TimeFormat } from '../../../shared/types';
import { TagCreationParams } from './tag-creation-params';
import { AccountTagsActionTypes } from '../../../reducers/account-tags/redux/account-tags.actions';

export enum UserTagsActionTypes {
  SetDefaultUserTagsAtStartup = '[App initializer] Set default user tags',
  SetDefaultUserTagsDueToLogout = '[Logout] Set default user tags',
  SetDefaultUserTagDueToDelete = '[Resource tag deleted] Set default user tag',

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

  UpdateVmLogsShowLastMessages = '[Settings Page] Update "csui.user.vm-logs-show-last-messages" tag',
  UpdateVmLogsShowLastMessagesSuccess = '[Resource tags API] Update "csui.user.vm-logs-show-last-messages" tag success',
  UpdateVmLogsShowLastMessagesError = '[Resource tags API] Update "csui.user.vm-logs-show-last-messages" tag error',

  UpdateVmLogsShowLastMinutes = '[Settings Page] Update "csui.user.vm-logs-show-last-minutes" tag',
  UpdateVmLogsShowLastMinutesSuccess = '[Resource tags API] Update "csui.user.vm-logs-show-last-minutes" tag success',
  UpdateVmLogsShowLastMinutesError = '[Resource tags API] Update "csui.user.vm-logs-show-last-minutes" tag error',

  SetSPFAVM = '[Dialog] Set "csui.user.save-password-for-all-vms" tag',
  SetSPFAVMSuccess = '[Resource tags API] Set "csui.user.save-password-for-all-vms" tag success',
  SetSPFAVMError = '[Resource tags API] Set "csui.user.save-password-for-all-vms" tag error',

  IncrementLastVMId = '[VM creation] Increment "csui.user.last-vm-id" tag',
  IncrementLastVMIdSuccess = '[Resource tags API] Increment "csui.user.last-vm-id" tag success',
  IncrementLastVMIdError = '[Resource tags API] Increment "csui.user.last-vm-id" tag error',

  UpdateVmLogsFilters = '[VM Logs] Update "csui.user.vm-logs.___" tags',
  UpdateVmLogsFiltersSuccess = '[Resource tags API] Update "csui.user.vm-logs.___" tags success',
  UpdateVmLogsFiltersError = '[Resource tags API] Update "csui.user.vm-logs.___" tags error',

  UpdateCustomServiceOfferingParams = '[VM creation] Set "csui.user.service-offering.param" tag',

  UpdateSidebarWidth = '[Sidebar resize] Update "csui.user.sidebar-width" tag',

  UpdateTag = '[Settings Page] Update user tag',
  UpdateTagError = '[Settings Page] Update user tag error',
  UpdateTagSuccess = '[Settings Page] Update user tag success',

  DeleteTag = '[Settings Page] Delete user tag',
  DeleteTagError = '[Settings Page] Delete user tag error',
  DeleteTagSuccess = '[Settings Page] Delete user tag success',

  CreateTag = '[Settings Page] Create user tag',
  CreateTagError = '[Settings Page] Create user tag error',
  CreateTagSuccess = '[Settings Page] Create user tag success',

  UpdateUserTagsFilter = '[Settings Page] Update user tags filter',
}

// We need SetDefaultUserTags actions to set values from default and user configs
// which available after store initialization, so we can not initialize them in the initialState for the reducer
export class SetDefaultUserTagsAtStartup implements Action {
  readonly type = UserTagsActionTypes.SetDefaultUserTagsAtStartup;

  constructor(readonly payload: { tags: Tag[] }) {}
}

export class SetDefaultUserTagsDueToLogout implements Action {
  readonly type = UserTagsActionTypes.SetDefaultUserTagsDueToLogout;

  constructor(readonly payload: { tags: Tag[] }) {}
}

export class SetDefaultUserTagDueToDelete implements Action {
  readonly type = UserTagsActionTypes.SetDefaultUserTagDueToDelete;

  constructor(readonly payload?: Tag) {}
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

  constructor(readonly payload: TagCreationParams) {}
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

  constructor(readonly payload: TagCreationParams) {}
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

  constructor(readonly payload: TagCreationParams) {}
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

  constructor(readonly payload: TagCreationParams) {}
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

  constructor(readonly payload: TagCreationParams) {}
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

  constructor(readonly payload: TagCreationParams) {}
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

  constructor(readonly payload: TagCreationParams) {}
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

  constructor(readonly payload: TagCreationParams) {}
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

  constructor(readonly payload: TagCreationParams) {}
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

  constructor(readonly payload: TagCreationParams) {}
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

  constructor(readonly payload: TagCreationParams) {}
}

export class UpdateKeyboardLayoutForVmsError implements Action {
  readonly type = UserTagsActionTypes.UpdateKeyboardLayoutForVmsError;

  constructor(readonly payload: { error: Error }) {}
}

// VM Logs show last messages

export class UpdateVmLogsShowLastMessages implements Action {
  readonly type = UserTagsActionTypes.UpdateVmLogsShowLastMessages;

  constructor(readonly payload: { value: number }) {}
}

export class UpdateVmLogsShowLastMessagesSuccess implements Action {
  readonly type = UserTagsActionTypes.UpdateVmLogsShowLastMessagesSuccess;

  constructor(readonly payload: TagCreationParams) {}
}

export class UpdateVmLogsShowLastMessagesError implements Action {
  readonly type = UserTagsActionTypes.UpdateVmLogsShowLastMessagesError;

  constructor(readonly payload: { error: Error }) {}
}

// VM Logs show last minutes

export class UpdateVmLogsShowLastMinutes implements Action {
  readonly type = UserTagsActionTypes.UpdateVmLogsShowLastMinutes;

  constructor(readonly payload: { value: number }) {}
}

export class UpdateVmLogsShowLastMinutesSuccess implements Action {
  readonly type = UserTagsActionTypes.UpdateVmLogsShowLastMinutesSuccess;

  constructor(readonly payload: TagCreationParams) {}
}

export class UpdateVmLogsShowLastMinutesError implements Action {
  readonly type = UserTagsActionTypes.UpdateVmLogsShowLastMinutesError;

  constructor(readonly payload: { error: Error }) {}
}

// Save password for all VMs

export class SetSavePasswordForAllVMs implements Action {
  readonly type = UserTagsActionTypes.SetSPFAVM;

  constructor(readonly payload: { value: boolean }) {}
}

export class SetSavePasswordForAllVMsSuccess implements Action {
  readonly type = UserTagsActionTypes.SetSPFAVMSuccess;

  constructor(readonly payload: TagCreationParams) {}
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

  constructor(readonly payload: TagCreationParams) {}
}

export class IncrementLastVMIdError implements Action {
  readonly type = UserTagsActionTypes.IncrementLastVMIdError;

  constructor(readonly payload: { error: Error }) {}
}

export class UpdateCustomServiceOfferingParams implements Action {
  readonly type = UserTagsActionTypes.UpdateCustomServiceOfferingParams;

  constructor(readonly payload: { offering: ServiceOffering }) {}
}

export class UpdateVmLogsFilters implements Action {
  readonly type = UserTagsActionTypes.UpdateVmLogsFilters;

  constructor(readonly payload: { [key: string]: string }) {}
}

export class UpdateVmLogsFiltersSuccess implements Action {
  readonly type = UserTagsActionTypes.UpdateVmLogsFiltersSuccess;

  constructor(readonly payload: TagCreationParams[]) {}
}

export class UpdateVmLogsFiltersError implements Action {
  readonly type = UserTagsActionTypes.UpdateVmLogsFiltersError;

  constructor(readonly payload: { error: Error }) {}
}

// Sidebar

export class UpdateSidebarWidth implements Action {
  readonly type = UserTagsActionTypes.UpdateSidebarWidth;

  constructor(readonly payload: { value: string }) {}
}

// Settings

export class UpdateTag implements Action {
  readonly type = UserTagsActionTypes.UpdateTag;

  constructor(readonly payload: TagUpdatingParams) {}
}

export class UpdateTagSuccess implements Action {
  readonly type = UserTagsActionTypes.UpdateTagSuccess;

  constructor(readonly payload: TagUpdatingParams) {}
}

export class UpdateTagError implements Action {
  readonly type = UserTagsActionTypes.UpdateTagError;

  constructor(readonly payload: { error: Error }) {}
}

export class CreateTag implements Action {
  readonly type = UserTagsActionTypes.CreateTag;

  constructor(readonly payload: TagCreationParams) {}
}

export class CreateTagSuccess implements Action {
  readonly type = UserTagsActionTypes.CreateTagSuccess;

  constructor(readonly payload: TagCreationParams) {}
}

export class CreateTagError implements Action {
  readonly type = UserTagsActionTypes.CreateTagError;

  constructor(readonly payload: { error: Error }) {}
}

export class DeleteTag implements Action {
  readonly type = UserTagsActionTypes.DeleteTag;

  constructor(readonly payload: string) {}
}

export class DeleteTagSuccess implements Action {
  readonly type = UserTagsActionTypes.DeleteTagSuccess;

  constructor(readonly payload: string) {}
}

export class DeleteTagError implements Action {
  readonly type = UserTagsActionTypes.DeleteTagError;

  constructor(readonly payload: { error: Error }) {}
}

export class UpdateUserTagsFilter implements Action {
  readonly type = UserTagsActionTypes.UpdateUserTagsFilter;

  constructor(public payload: { showSystemTag: boolean }) {}
}

export type UserTagsActionsUnion =
  | UpdateUserTagsFilter
  | UpdateTag
  | UpdateTagSuccess
  | UpdateTagError
  | CreateTag
  | CreateTagError
  | CreateTagSuccess
  | DeleteTag
  | DeleteTagError
  | DeleteTagSuccess
  | SetDefaultUserTagsAtStartup
  | SetDefaultUserTagsDueToLogout
  | SetDefaultUserTagDueToDelete
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
  | UpdateVmLogsShowLastMessages
  | UpdateVmLogsShowLastMessagesSuccess
  | UpdateVmLogsShowLastMessagesError
  | UpdateVmLogsShowLastMinutes
  | UpdateVmLogsShowLastMinutesSuccess
  | UpdateVmLogsShowLastMinutesError
  | SetSavePasswordForAllVMs
  | SetSavePasswordForAllVMsSuccess
  | SetSavePasswordForAllVMsError
  | IncrementLastVMId
  | IncrementLastVMIdSuccess
  | IncrementLastVMIdError
  | UpdateVmLogsFilters
  | UpdateVmLogsFiltersSuccess
  | UpdateVmLogsFiltersError
  | UpdateCustomServiceOfferingParams
  | UpdateSidebarWidth;
