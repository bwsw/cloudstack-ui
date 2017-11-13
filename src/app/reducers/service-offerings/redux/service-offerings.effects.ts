import { Injectable } from '@angular/core';
import {
  Actions,
  Effect
} from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import * as serviceOfferingActions from './service-offerings.actions';
import { Action } from '@ngrx/store';
import { ServiceOfferingService } from '../../../shared/services/service-offering.service';
import { ServiceOffering } from '../../../shared/models/service-offering.model';

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
    private offeringService: ServiceOfferingService
  ) { }
}
