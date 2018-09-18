import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { ServiceOffering } from '../../../shared/models';
import { ServiceOfferingService } from '../../../shared/services/service-offering.service';
import * as serviceOfferingActions from './service-offerings.actions';

@Injectable()
export class ServiceOfferingEffects {
  @Effect()
  loadOfferings$: Observable<Action> = this.actions$
    .ofType(serviceOfferingActions.LOAD_SERVICE_OFFERINGS_REQUEST)
    .switchMap((action: serviceOfferingActions.LoadOfferingsRequest) => {
      return this.offeringService.getList(action.payload)
        .map((offerings: ServiceOffering[]) => {
          return new serviceOfferingActions.LoadOfferingsResponse(offerings);
        })
        .catch(() => Observable.of(new serviceOfferingActions.LoadOfferingsResponse([])));
    });

  constructor(
    private actions$: Actions,
    private offeringService: ServiceOfferingService,
  ) {
  }
}
