import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ServiceOffering } from '../../../shared/models';
import { ServiceOfferingService } from '../../../shared/services/service-offering.service';
import * as serviceOfferingActions from './service-offerings.actions';

@Injectable()
export class ServiceOfferingEffects {
  @Effect()
  loadOfferings$: Observable<Action> = this.actions$.pipe(
    ofType(serviceOfferingActions.LOAD_SERVICE_OFFERINGS_REQUEST),
    switchMap((action: serviceOfferingActions.LoadOfferingsRequest) => {
      return this.offeringService.getList(action.payload).pipe(
        map((offerings: ServiceOffering[]) => {
          return new serviceOfferingActions.LoadOfferingsResponse(offerings);
        }),
        catchError(() => of(new serviceOfferingActions.LoadOfferingsResponse([]))),
      );
    }),
  );

  constructor(private actions$: Actions, private offeringService: ServiceOfferingService) {}
}
