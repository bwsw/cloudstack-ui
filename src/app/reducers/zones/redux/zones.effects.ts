import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import { ZoneService } from '../../../shared/services/zone.service';
import { Zone } from '../../../shared/models';
import * as zoneActions from './zones.actions';

@Injectable()
export class ZonesEffects {

  @Effect()
  loadZones$: Observable<Action> = this.actions$
    .ofType(zoneActions.LOAD_ZONES_REQUEST)
    .switchMap((action: zoneActions.LoadZonesRequest) => {
      return this.zoneService.getList(action.payload)
        .map((zones: Zone[]) => {
          return new zoneActions.LoadZonesResponse(zones);
        })
        .catch(() => Observable.of(new zoneActions.LoadZonesResponse([])));
    });

  constructor(
    private actions$: Actions,
    private zoneService: ZoneService
  ) {
  }
}
