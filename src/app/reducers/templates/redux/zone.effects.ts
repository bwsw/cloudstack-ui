import { Injectable } from '@angular/core';
import {
  Actions,
  Effect
} from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { ZoneService } from '../../../shared/services/zone.service';
import { Zone } from '../../../shared/models/zone.model';

import * as zonesActions from './zone.actions';


@Injectable()
export class ZoneEffects {

  @Effect()
  loadZones$: Observable<Action> = this.actions$
    .ofType(zonesActions.LOAD_ZONES_REQUEST)
    .switchMap((action: zonesActions.LoadZonesRequest) => {
      return this.zoneService.getList(action.payload)
        .map((zones: Zone[]) => {
          return new zonesActions.LoadZonesResponse(zones);
        })
        .catch(() => Observable.of(new zonesActions.LoadZonesResponse([])));
    });

  constructor(
    private actions$: Actions,
    private zoneService: ZoneService
  ) {
  }
}
