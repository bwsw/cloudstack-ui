import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { State } from '../../index';
import * as capabilitiesActions from './capabilities.actions';
import { Capabilities } from '../../../shared/models/capabilities.model';
import { CapabilityService } from '../../../shared/services/capability.service';

@Injectable()
export class ConfigurationEffects {
  @Effect()
  loadCapabilities$: Observable<Action> = this.actions$.pipe(
    ofType(capabilitiesActions.ActionTypes.LOAD_CAPABILITIES_REQUEST),
    switchMap(() => {
      return this.capabilityService.getList(action.payload).pipe(
        map((capabilities: Capabilities) => {
          return new capabilitiesActions.LoadConfigurationsResponse(capabilities);
        }),
        // todo:
        // catchError(() => new authActions.Logout()),
      );
    }),
  );

  constructor(
    private store: Store<State>,
    private actions$: Actions,
    private capabilityService: CapabilityService,
  ) {}
}
