import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map, withLatestFrom } from 'rxjs/operators';

import { isOfferingLocal, Offering } from '../models/offering.model';
import { OfferingAvailability, Zone } from '../models';
import { BaseBackendService } from './base-backend.service';
import { configSelectors, State } from '../../root-store';

@Injectable()
export abstract class OfferingService<T extends Offering> extends BaseBackendService<T> {
  constructor(
    protected http: HttpClient,
    private store: Store<State>,
  ) {
    super(http);
  }

  public get(id: string): Observable<T> {
    return super.get(id);
  }

  public getList(params?: any): Observable<Array<T>> {
    if (!params || !params.zone) {
      return super.getList(params);
    }
    const zone = params.zone;
    const modifiedParams = Object.assign({}, params);
    delete modifiedParams.zone;

    return super.getList(modifiedParams).pipe(
      withLatestFrom(this.store.select(configSelectors.get('offeringAvailability'))),
      map(([offeringList, offeringAvailability]) =>
        this.getOfferingsAvailableInZone(offeringList, offeringAvailability, zone)
      )
    );
  }

  public getOfferingsAvailableInZone(
    offeringList: Array<T>,
    offeringAvailability: OfferingAvailability,
    zone: Zone
  ): Array<T> {
    if (!offeringAvailability.filterOfferings) {
      return offeringList;
    }

    return offeringList
      .filter(offering => {
        const offeringAvailableInZone = this.isOfferingAvailableInZone(
          offering,
          offeringAvailability,
          zone
        );
        const localStorageCompatibility = zone.localstorageenabled || !isOfferingLocal(offering);
        return offeringAvailableInZone && localStorageCompatibility;
      });
  }

  protected abstract isOfferingAvailableInZone(
    offering: Offering,
    offeringAvailability: OfferingAvailability,
    zone: Zone
  ): boolean;
}
