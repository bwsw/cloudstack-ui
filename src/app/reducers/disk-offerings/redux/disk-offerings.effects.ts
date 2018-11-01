import { Injectable } from '@angular/core';
import { Action, select, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import * as diskOfferingActions from './disk-offerings.actions';
import { DiskOfferingService } from '../../../shared/services/disk-offering.service';
import { DiskOffering } from '../../../shared/models';
import * as fromAccounts from '../../accounts/redux/accounts.reducers';
import { State } from '../../index';

@Injectable()
export class DiskOfferingEffects {
  @Effect()
  loadOfferings$: Observable<Action> = this.actions$.pipe(
    ofType(diskOfferingActions.LOAD_DISK_OFFERINGS_REQUEST),
    withLatestFrom(this.store.pipe(select(fromAccounts.selectStorageAvailable))),
    switchMap(
      ([action, storageAvailable]: [diskOfferingActions.LoadOfferingsRequest, number | null]) => {
        const params = {
          zone: action.payload && action.payload.zone,
          maxSize: storageAvailable,
        };
        return this.offeringService.getList(params).pipe(
          map((offerings: DiskOffering[]) => {
            return new diskOfferingActions.LoadOfferingsResponse(offerings);
          }),
          catchError(() => of(new diskOfferingActions.LoadOfferingsResponse([]))),
        );
      },
    ),
  );

  constructor(
    private actions$: Actions,
    private offeringService: DiskOfferingService,
    private store: Store<State>,
  ) {}
}
