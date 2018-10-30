import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { Account } from '../../../shared/models';
import { isRootAdmin } from '../../../shared/models/account.model';
import { Configuration } from '../../../shared/models/configuration.model';
import { ConfigurationService } from '../../../shared/services/configuration.service';
import { State } from '../../index';
import * as fromAuth from '../../auth/redux/auth.reducers';
import * as configurationActions from './configurations.actions';

@Injectable()
export class ConfigurationEffects {
  @Effect()
  loadConfigurations$: Observable<Action> = this.actions$.pipe(
    ofType(configurationActions.LOAD_CONFIGURATIONS_REQUEST),
    withLatestFrom(this.store.pipe(select(fromAuth.getUserAccount))),
    switchMap(([action, account]: [configurationActions.LoadConfigurationsRequest, Account]) => {
      return account && isRootAdmin(account)
        ? this.configurationService.getList(action.payload).pipe(
            map((configurations: Configuration[]) => {
              return new configurationActions.LoadConfigurationsResponse(configurations);
            }),
            catchError(() => of(new configurationActions.LoadConfigurationsResponse([]))),
          )
        : of(new configurationActions.LoadConfigurationsResponse([]));
    }),
  );

  @Effect()
  updateConfiguration$: Observable<Action> = this.actions$.pipe(
    ofType(configurationActions.UPDATE_CONFIGURATIONS_REQUEST),
    mergeMap((action: configurationActions.UpdateConfigurationRequest) => {
      return this.configurationService
        .updateConfiguration(action.payload.configuration, action.payload.account)
        .pipe(
          map(() => {
            return new configurationActions.LoadConfigurationsRequest({
              accountid: action.payload.account.id,
            });
          }),
          catchError(error => of(new configurationActions.UpdateConfigurationError(error))),
        );
    }),
  );

  @Effect({ dispatch: false })
  updateConfigurationError$: Observable<Action> = this.actions$.pipe(
    ofType(configurationActions.UPDATE_CONFIGURATIONS_ERROR),
    tap((action: configurationActions.UpdateConfigurationError) => {
      this.handleError(action.payload);
    }),
  );

  constructor(
    private store: Store<State>,
    private actions$: Actions,
    private configurationService: ConfigurationService,
    private dialogService: DialogService,
  ) {}

  private handleError(error): void {
    this.dialogService.alert({
      message: {
        translationToken: error.message,
        interpolateParams: error.params,
      },
    });
  }
}
