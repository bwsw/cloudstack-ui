import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { ServiceOffering } from '../../../shared/models';
import { ServiceOfferingService } from '../../../shared/services/service-offering.service';
import * as accountTagActions from '../../account-tags/redux/account-tags.actions';
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

  @Effect()
  updateCustomServiceOffering$: Observable<Action> = this.actions$
    .ofType(serviceOfferingActions.UPDATE_CUSTOM_SERVICE_OFFERING)
    .map((action: serviceOfferingActions.UpdateCustomServiceOffering) => {
      return new accountTagActions.UpdateCustomServiceOfferingParams(action.payload);
    });

  constructor(
    private actions$: Actions,
    private offeringService: ServiceOfferingService,
  ) {
  }
}
