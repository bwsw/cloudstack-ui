import { Action } from '@ngrx/store';

import { SettingsViewModel } from '../view-models';


export enum SettingsActionTypes {
  UPDATE_SETTINGS = '[Settings] Update settings'
}

export class UpdateSettings implements Action {
  readonly type = SettingsActionTypes.UPDATE_SETTINGS;

  constructor(public payload: SettingsViewModel) {
  }
}
