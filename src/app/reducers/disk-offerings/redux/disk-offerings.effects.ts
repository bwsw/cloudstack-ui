import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import * as diskOfferingActions from './disk-offerings.actions';
import { Action } from '@ngrx/store';
import { DiskOfferingService } from '../../../shared/services/disk-offering.service';
import { DiskOffering } from '../../../shared/models/disk-offering.model';
import { ConfigService } from '../../../core/services';

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
  loadDefaultParams$: Observable<Action> = this.actions$
    .ofType(diskOfferingActions.LOAD_DEFAULT_DISK_PARAMS_REQUEST)
    .map((action: diskOfferingActions.LoadDefaultParamsRequest) => {
      const paramsFromConfig = this.configService
        .get('diskOfferingParameters');
      let params = defaultDiskOfferingParams;

      if (paramsFromConfig && Object.entries(paramsFromConfig).length) {
        params = params.concat(paramsFromConfig);
      }

      return new diskOfferingActions.LoadDefaultParamsResponse(params);
    });

  constructor(
    private actions$: Actions,
    private offeringService: DiskOfferingService,
    private configService: ConfigService
  ) { }
}
