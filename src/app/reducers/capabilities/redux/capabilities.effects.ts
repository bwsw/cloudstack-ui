import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as capabilitiesActions from './capabilities.actions';
import { Capabilities } from '../../../shared/models';
import { CapabilityService } from '../../../shared/services/capability.service';
import * as authActions from '../../../auth/store/auth.actions';

@Injectable()
export class CapabilitiesEffects {
  @Effect()
  loadCapabilities$: Observable<Action> = this.actions$.pipe(
    ofType(capabilitiesActions.ActionTypes.LOAD_CAPABILITIES_REQUEST),
    switchMap(() => {
      return this.capabilityService.get().pipe(
        map((capabilities: Capabilities) => {
          return new capabilitiesActions.LoadCapabilitiesResponse(capabilities);
        }),
        catchError(() => of(new capabilitiesActions.LoadCapabilitiesError())),
      );
    }),
  );

  @Effect()
  logoutOnError$: Observable<Action> = this.actions$.pipe(
    ofType(capabilitiesActions.ActionTypes.LOAD_CAPABILITIES_ERROR),
    map(() => new authActions.Logout()),
  );

  constructor(private actions$: Actions, private capabilityService: CapabilityService) {}
}
