import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ZoneService } from '../../../shared/services/zone.service';
import { Zone } from '../../../shared/models';

import * as zonesActions from './zone.actions';

@Injectable()
export class ZoneEffects {
  @Effect()
  loadZones$: Observable<Action> = this.actions$.pipe(
    ofType(zonesActions.LOAD_ZONES_REQUEST),
    switchMap((action: zonesActions.LoadZonesRequest) => {
      return this.zoneService.getList(action.payload).pipe(
        map((zones: Zone[]) => {
          return new zonesActions.LoadZonesResponse(zones);
        }),
        catchError(() => of(new zonesActions.LoadZonesResponse([]))),
      );
    }),
  );

  constructor(private actions$: Actions, private zoneService: ZoneService) {}
}
