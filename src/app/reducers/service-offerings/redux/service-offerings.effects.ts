import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
// tslint:disable-next-line
import { DefaultCustomServiceOfferingRestrictions } from '../../../service-offering/custom-service-offering/custom-offering-restrictions';
// tslint:disable-next-line
import {
  customServiceOfferingFallbackParams,
  DefaultServiceOfferingConfigurationByZone
} from '../../../service-offering/custom-service-offering/service/custom-service-offering.service';
import { ServiceOffering } from '../../../shared/models/service-offering.model';
import { ConfigService } from '../../../shared/services/config.service';
import { ServiceOfferingService } from '../../../shared/services/service-offering.service';
import { ServiceOfferingTagService } from '../../../shared/services/tags/service-offering-tag.service';

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
      const paramsFromConfig = this.configService
        .get<DefaultServiceOfferingConfigurationByZone>('defaultServiceOfferingConfig');
      const params = paramsFromConfig && Object.entries(paramsFromConfig).length
        ? paramsFromConfig : customServiceOfferingFallbackParams;

      return new serviceOfferingActions.LoadDefaultParamsResponse(params);
    });

  @Effect()
  loadCustomRestrictions$: Observable<Action> = this.actions$
    .ofType(serviceOfferingActions.LOAD_CUSTOM_RESTRICTION_REQUEST)
    .map((action: serviceOfferingActions.LoadCustomRestrictionsRequest) => {
      const restrictions = this.configService.get('customOfferingRestrictions')
      && Object.entries(this.configService.get('customOfferingRestrictions')).length
        ? this.configService.get('customOfferingRestrictions')
        : DefaultCustomServiceOfferingRestrictions;

      return new serviceOfferingActions.LoadCustomRestrictionsResponse(restrictions);
    });

  @Effect()
  loadCompatibilityPolicy$: Observable<Action> = this.actions$
    .ofType(serviceOfferingActions.LOAD_COMPATIBILITY_POLICY_REQUEST)
    .map((action: serviceOfferingActions.LoadCompatibilityPolicyRequest) => {
      return new serviceOfferingActions.LoadCompatibilityPolicyResponse(
        this.configService.get('offeringCompatibilityPolicy')
      );
    });

  @Effect()
  setOfferingGroup$: Observable<Action> = this.actions$
    .ofType(serviceOfferingActions.SET_SERVICE_OFFERING_GROUP)
    .switchMap((action: serviceOfferingActions.SetServiceOfferingGroup) =>
        this.serviceOfferingTagService.setGroup(
        action.payload.serviceOffering,
        action.payload.serviceOfferingGroup
      )
      .map(temp => new serviceOfferingActions.SetServiceOfferingGroupSuccess(temp))
      .catch(error => Observable.of(new serviceOfferingActions.SetServiceOfferingGroupError(error))));

  @Effect()
  resetOfferingGroup$: Observable<Action> = this.actions$
    .ofType(serviceOfferingActions.RESET_SERVICE_OFFERING_GROUP)
    .switchMap((action: serviceOfferingActions.ResetServiceOfferingGroup) =>
      this.serviceOfferingTagService.resetGroup(action.payload)
        .map(temp => new serviceOfferingActions.ResetServiceOfferingGroupSuccess(action.payload))
        .catch(error => Observable.of(new serviceOfferingActions.SetServiceOfferingGroupError(error))));

  @Effect({ dispatch: false })
  setOfferingGroupError$: Observable<Action> = this.actions$
    .ofType(serviceOfferingActions.SET_SERVICE_OFFERING_GROUP_ERROR)
    .do((action: serviceOfferingActions.SetServiceOfferingGroupError) => {
      this.handleError(action.payload);
    });

  constructor(
    private actions$: Actions,
    private offeringService: ServiceOfferingService,
    private serviceOfferingTagService: ServiceOfferingTagService,
    private configService: ConfigService,
    private dialogService: DialogService
  ) { }

  private handleError(error: any): void {
    this.dialogService.alert({
      message: {
        translationToken: error.message,
        interpolateParams: error.params
      }
    });
  }
}
