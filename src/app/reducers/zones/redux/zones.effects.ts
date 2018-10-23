import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ZoneService } from '../../../shared/services/zone.service';
import { Zone } from '../../../shared/models';
import * as zoneActions from './zones.actions';

@Injectable()
export class ZonesEffects {
  @Effect()
  loadZones$: Observable<Action> = this.actions$.pipe(
    ofType(zoneActions.LOAD_ZONES_REQUEST),
    switchMap((action: zoneActions.LoadZonesRequest) => {
      return this.zoneService.getList(action.payload).pipe(
        map((zones: Zone[]) => {
          return new zoneActions.LoadZonesResponse(zones);
        }),
        catchError(() => of(new zoneActions.LoadZonesResponse([]))),
      );
    }),
  );

  constructor(private actions$: Actions, private zoneService: ZoneService) {}
}
