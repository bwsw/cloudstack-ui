import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { first } from 'rxjs/operators/first';
import { mergeMap } from 'rxjs/operators/mergeMap';

import { State, UserTagsActions } from '../../root-store';
import { SettingsActionTypes, UpdateSettings } from './settings.action';
import { SettingsViewModel } from '../view-models';
import { getSettingsViewModel } from './settings.selectors';

interface Change {
  key: string,
  value: any
}

function getDifferentKeysAndValues(current: SettingsViewModel, changed: SettingsViewModel): Change[] {
  return Object.entries(changed)
    .filter(([key, value]) => current[key] !== value)
    .map(([key, value]) => {
      return { key, value };
    });
}


@Injectable()
export class SettingsEffects {
  @Effect()
  updateSettings$: Observable<Action> = this.actions$.pipe(
    ofType<UpdateSettings>(SettingsActionTypes.UPDATE_SETTINGS),
    map(action => action.payload),
    mergeMap(settings =>
      this.findChangedSettingValuesWithKeys(settings).pipe(
        mergeMap(changes => changes),
        map(this.dispatchUpdateSetting)
      )
    )
  );

  constructor(private actions$: Actions, private store: Store<State>) {
  }

  private findChangedSettingValuesWithKeys(changedSettings: SettingsViewModel): Observable<Change[]> {
    return this.store.select(getSettingsViewModel)
      .pipe(
        first(),
        map(settings => getDifferentKeysAndValues(settings, changedSettings))
      );
  }

  private dispatchUpdateSetting(change: Change) {
    const value = change.value;
    switch (change.key) {
      // cases based on SettingsViewModel properties
      case 'sessionTimeout': {
        return new UserTagsActions.UpdateSessionTimeoutTag({ value });
      }
      case 'isSavePasswordForVMs': {
        return new UserTagsActions.UpdateSavePasswordForAllVMsTag({ value });
      }
      case 'interfaceLanguage': {
        return new UserTagsActions.UpdateInterfaceLanguageTag({ value })
      }
      case 'firstDayOfWeek': {
        return new UserTagsActions.UpdateFirstDayOfWeekTag({ value });
      }
      case 'timeFormat': {
        return new UserTagsActions.UpdateTimeFormatTag({ value });
      }
      case 'theme': {
        return new UserTagsActions.UpdateThemeTag({ value });
      }
    }
  }
}
