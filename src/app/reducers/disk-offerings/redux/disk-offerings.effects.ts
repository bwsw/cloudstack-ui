import { Injectable } from '@angular/core';
import {
  Actions,
  Effect
} from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import * as diskOfferingActions from './disk-offerings.actions';
import { Action } from '@ngrx/store';
import { DiskOfferingService } from '../../../shared/services/disk-offering.service';
import { DiskOffering } from '../../../shared/models/disk-offering.model';

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

  constructor(
    private actions$: Actions,
    private offeringService: DiskOfferingService
  ) { }
}
