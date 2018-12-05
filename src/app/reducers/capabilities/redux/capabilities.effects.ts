import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { State } from '../../index';
import * as capabilitiesActions from './capabilities.actions';
import { Capabilities } from '../../../shared/models/capabilities.model';
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
        catchError(() => of(new authActions.Logout())),
      );
    }),
  );

  constructor(
    private store: Store<State>,
    private actions$: Actions,
    private capabilityService: CapabilityService,
  ) {}
}
