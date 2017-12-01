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
import { ConfigService } from '../../../shared/services/config.service';
import { DefaultServiceOfferingConfigurationByZone } from '../../../service-offering/custom-service-offering/service/custom-service-offering.service';

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
  loadOfferingAvailability$: Observable<Action> = this.actions$
    .ofType(serviceOfferingActions.LOAD_OFFERING_AVAILABILITY_REQUEST)
    .map((action: serviceOfferingActions.LoadOfferingAvailabilityRequest) => {
      return new serviceOfferingActions.LoadOfferingAvailabilityResponse(
        this.configService.get('offeringAvailability')
      );
    });

  @Effect()
  loadDefaultParams$: Observable<Action> = this.actions$
    .ofType(serviceOfferingActions.LOAD_DEFAULT_PARAMS_REQUEST)
    .map((action: serviceOfferingActions.LoadDefaultParamsRequest) => {
      return new serviceOfferingActions.LoadDefaultParamsResponse(
        this.configService.get<DefaultServiceOfferingConfigurationByZone>(
          'defaultServiceOfferingConfig')
      );
    });

  @Effect()
  loadCustomRestrictions$: Observable<Action> = this.actions$
    .ofType(serviceOfferingActions.LOAD_CUSTOM_RESTRICTION_REQUEST)
    .map((action: serviceOfferingActions.LoadCustomRestrictionsRequest) => {
      return new serviceOfferingActions.LoadCustomRestrictionsResponse(
        this.configService.get('customOfferingRestrictions')
      );
    });

  constructor(
    private actions$: Actions,
    private offeringService: ServiceOfferingService,
    private configService: ConfigService
  ) { }
}
