import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { defer, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import {
  ConfigActionTypes,
  LoadConfig,
  LoadConfigError,
  LoadConfigSuccess,
} from './config.actions';
import { ConfigValidationService } from '../../core/config';

@Injectable()
export class ConfigEffects {
  @Effect()
  loadConfig$: Observable<Action> = this.actions$.pipe(
    ofType<LoadConfig>(ConfigActionTypes.LoadConfig),
    switchMap(() =>
      this.http.get('config/config.json').pipe(
        map(data => this.configValidationService.validate(data)),
        map(config => new LoadConfigSuccess({ config })),
        catchError(error => of(new LoadConfigError({ error }))),
      ),
    ),
  );

  @Effect()
  init$: Observable<Action> = defer(() => {
    return of(new LoadConfig());
  });

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private configValidationService: ConfigValidationService,
  ) {}
}
