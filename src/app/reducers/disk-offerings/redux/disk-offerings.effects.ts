import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { map, withLatestFrom } from 'rxjs/operators';

import * as diskOfferingActions from './disk-offerings.actions';
import { DiskOfferingService } from '../../../shared/services/disk-offering.service';
import { DiskOffering } from '../../../shared/models/disk-offering.model';
import { configSelectors, State } from '../../../root-store';

const defaultDiskOfferingParams: Array<string> = [
  'name',
  'bytesreadrate',
  'byteswriterate',
  'iopsreadrate',
  'iopswriterate'
];

@Injectable()
export class DiskOfferingEffects {

  @Effect()
  loadOfferings$: Observable<Action> = this.actions$
    .ofType(diskOfferingActions.LOAD_DISK_OFFERINGS_REQUEST)
    .switchMap((action: diskOfferingActions.LoadOfferingsRequest) => {
      return this.offeringService.getList(action.payload)
        .map((offerings: DiskOffering[]) => {
          return new diskOfferingActions.LoadOfferingsResponse(offerings);
        })
        .catch(() => Observable.of(new diskOfferingActions.LoadOfferingsResponse([])));
    });

  @Effect()
  loadDefaultParams$: Observable<Action> = this.actions$.pipe(
    ofType<diskOfferingActions.LoadDefaultParamsRequest>(diskOfferingActions.LOAD_DEFAULT_DISK_PARAMS_REQUEST),
    withLatestFrom(this.store.select(configSelectors.get('diskOfferingParameters'))),
    map(([action, diskOfferingParams]) => {
      let params = defaultDiskOfferingParams;

      if (diskOfferingParams && Object.entries(diskOfferingParams).length) {
        params = params.concat(diskOfferingParams);
      }

      return new diskOfferingActions.LoadDefaultParamsResponse(params);
    })
  );

  constructor(
    private actions$: Actions,
    private offeringService: DiskOfferingService,
    private store: Store<State>
  ) {
  }
}
