import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import * as diskOfferingActions from './disk-offerings.actions';
import { DiskOfferingService } from '../../../shared/services/disk-offering.service';
import { DiskOffering } from '../../../shared/models';

@Injectable()
export class DiskOfferingEffects {
  @Effect()
  loadOfferings$: Observable<Action> = this.actions$.pipe(
    ofType(diskOfferingActions.LOAD_DISK_OFFERINGS_REQUEST),
    switchMap((action: diskOfferingActions.LoadOfferingsRequest) => {
      return this.offeringService.getList(action.payload).pipe(
        map((offerings: DiskOffering[]) => {
          return new diskOfferingActions.LoadOfferingsResponse(offerings);
        }),
        catchError(() => of(new diskOfferingActions.LoadOfferingsResponse([]))),
      );
    }),
  );

  constructor(private actions$: Actions, private offeringService: DiskOfferingService) {}
}
