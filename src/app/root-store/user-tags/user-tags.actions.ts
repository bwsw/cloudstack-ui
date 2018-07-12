import { Action } from '@ngrx/store';

import { Tag } from '../../shared/models';
import { DayOfWeek, Language, TimeFormat } from '../../shared/types';


export enum UserTagsActionTypes {
  LOAD_USER_TAGS = '[User tags] Load User tags',
  USER_TAGS_LOADED = '[User tags] User tags loaded',
  USER_TAGS_LOAD_ERROR = '[User tags] User tags load error',
  USER_TAG_UPDATED = '[User tags] User tag updated',
  USER_TAG_UPDATE_ERROR = '[User tags] User tag update error',
  UPDATE_ASK_TO_CREATE_VM_TAG = '[User tags] Update "csui.user.ask-to-create-vm" tag',
  UPDATE_ASK_TO_CREATE_VOLUME_TAG = '[User tags] Update "csui.user.ask-to-create-volume" tag',
  UPDATE_SAVE_PASSWORD_FOR_ALL_VMS_TAG = '[User tags] Update "csui.user.save-password-for-all-vms" tag',
  UPDATE_FIRST_DAY_OF_WEEK_TAG = '[User tags] Update "csui.user.first-day-of-week" tag',
  UPDATE_INTERFACE_LANGUAGE_TAG = '[User tags] Update "csui.user.lang" tag',
  UPDATE_LAST_VM_ID_TAG = '[User tags] Update "csui.user.last-vm-id" tag',
  UPDATE_SESSION_TIMEOUT_TAG = '[User tags] Update "csui.user.session-timeout" tag',
  UPDATE_SHOW_SYSTEM_TAGS_TAG = '[User tags] Update "csui.user.show-system-tags" tag',
  UPDATE_TIME_FORMAT_TAG = '[User tags] Update "csui.user.time-format" tag',
  UPDATE_THEME_TAG = '[User tags] Update "csui.user.theme" tag',
  UPDATE_NAVIGATION_ORDER_TAG = '[User tags] Update "csui.user.navigation-order" tag'
}

export class LoadUserTags implements Action {
  readonly type = UserTagsActionTypes.LOAD_USER_TAGS;
}

export class UserTagsLoaded implements Action {
  readonly type = UserTagsActionTypes.USER_TAGS_LOADED;

  constructor(public payload: { tags: Tag[] }) {
  }
}

export class UserTagsLoadError implements Action {
  readonly type = UserTagsActionTypes.USER_TAGS_LOAD_ERROR;

  constructor(public payload: { error: Error }) {
  }
}

export class UserTagUpdated implements Action {
  readonly type = UserTagsActionTypes.USER_TAG_UPDATED;
}

export class UserTagUpdateError implements Action {
  readonly type = UserTagsActionTypes.USER_TAG_UPDATE_ERROR;

  constructor(public payload: { error: Error }) {
  }
}

export class UpdateAskToCreateVMTag implements Action {
  readonly type = UserTagsActionTypes.UPDATE_ASK_TO_CREATE_VM_TAG;

  constructor(public payload: { value: boolean }) {
  }
}

export class UpdateAskToCreateVolumeTag implements Action {
  readonly type = UserTagsActionTypes.UPDATE_ASK_TO_CREATE_VOLUME_TAG;

  constructor(public payload: { value: boolean }) {
  }
}

export class UpdateSavePasswordForAllVMsTag implements Action {
  readonly type = UserTagsActionTypes.UPDATE_SAVE_PASSWORD_FOR_ALL_VMS_TAG;

  constructor(public payload: { value: boolean }) {
  }
}

export class UpdateFirstDayOfWeekTag implements Action {
  readonly type = UserTagsActionTypes.UPDATE_FIRST_DAY_OF_WEEK_TAG;

  constructor(public payload: { value: DayOfWeek }) {
  }
}

export class UpdateInterfaceLanguageTag implements Action {
  readonly type = UserTagsActionTypes.UPDATE_INTERFACE_LANGUAGE_TAG;

  constructor(public payload: { value: Language }) {
  }
}

export class UpdateLastVMIdTag implements Action {
  readonly type = UserTagsActionTypes.UPDATE_LAST_VM_ID_TAG;

  constructor(public payload: { value: number }) {
  }
}

export class UpdateSessionTimeoutTag implements Action {
  readonly type = UserTagsActionTypes.UPDATE_SESSION_TIMEOUT_TAG;

  constructor(public payload: { value: number }) {
  }
}

export class UpdateShowSystemTagsTag implements Action {
  readonly type = UserTagsActionTypes.UPDATE_SHOW_SYSTEM_TAGS_TAG;

  constructor(public payload: { value: boolean }) {
  }
}

export class UpdateTimeFormatTag implements Action {
  readonly type = UserTagsActionTypes.UPDATE_TIME_FORMAT_TAG;

  constructor(public payload: { value: TimeFormat }) {
  }
}

export class UpdateThemeTag implements Action {
  readonly type = UserTagsActionTypes.UPDATE_THEME_TAG;

  constructor(public payload: { value: string }) {
  }
}

export class UpdateNavigationOrderTag implements Action {
  readonly type = UserTagsActionTypes.UPDATE_NAVIGATION_ORDER_TAG;

  constructor(public payload: { value: string }) {
  }
}

export type UserTagsActionsUnion =
  | LoadUserTags
  | UserTagsLoaded
  | UserTagsLoadError
  | UserTagUpdated
  | UserTagUpdateError
  | UpdateAskToCreateVMTag
  | UpdateAskToCreateVolumeTag
  | UpdateSavePasswordForAllVMsTag
  | UpdateFirstDayOfWeekTag
  | UpdateInterfaceLanguageTag
  | UpdateLastVMIdTag
  | UpdateSessionTimeoutTag
  | UpdateShowSystemTagsTag
  | UpdateTimeFormatTag
  | UpdateThemeTag
  | UpdateNavigationOrderTag;
