import { Injectable } from '@angular/core';
import {
  Actions,
  Effect
} from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import * as configurationActions from './configurations.actions';
import { Action } from '@ngrx/store';
import { ConfigurationService } from '../../../shared/services/configuration.service';
import { Configuration } from '../../../shared/models/configuration.model';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';

@Injectable()
export class ConfigurationEffects {

  @Effect()
  loadConfigurations$: Observable<Action> = this.actions$
    .ofType(configurationActions.LOAD_CONFIGURATIONS_REQUEST)
    .switchMap((action: configurationActions.LoadConfigurationsRequest) => {
      return this.configurationService.getList(action.payload)
        .map((configurations: Configuration[]) => {
          return new configurationActions.LoadConfigurationsResponse(configurations);
        })
        .catch(() => Observable.of(new configurationActions.LoadConfigurationsResponse([])));
    });

  @Effect()
  updateConfiguration$: Observable<Action> = this.actions$
    .ofType(configurationActions.UPDATE_CONFIGURATIONS_REQUEST)
    .switchMap((action: configurationActions.UpdateConfigurationRequest) => {
      return this.configurationService.updateConfiguration(
          action.payload.configuration,
          action.payload.account)
        .map(() => {
          return new configurationActions.LoadConfigurationsRequest({
            accountid: action.payload.account.id
          })
        })
        .catch((error) => Observable.of(new configurationActions.UpdateConfigurationError(error)));
    });

  @Effect({ dispatch: false })
  updateConfigurationError$: Observable<Action> = this.actions$
    .ofType(configurationActions.UPDATE_CONFIGURATIONS_ERROR)
    .do((action: configurationActions.UpdateConfigurationError) => {
      this.handleError(action.payload);
    });


  constructor(
    private actions$: Actions,
    private configurationService: ConfigurationService,
    private dialogService: DialogService
  ) {
  }

  private handleError(error): void {
    this.dialogService.alert({
      message: {
        translationToken: error.message,
        interpolateParams: error.params
      }
    });
  }
}
