import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

import { isOfferingLocal, Offering } from '../models/offering.model';
import { ServiceOfferingAvailability, Zone } from '../models';
import { BaseBackendService } from './base-backend.service';
import { configSelectors, State } from '../../root-store';

@Injectable()
export abstract class OfferingService<T extends Offering> extends BaseBackendService<T> {
  constructor(protected http: HttpClient, private store: Store<State>) {
    super(http);
  }

  public get(id: string): Observable<T> {
    return super.get(id);
  }

  public getList(params?: any): Observable<T[]> {
    if (!params || !params.zone) {
      return super.getList(params);
    }
    const zone = params.zone;
    const modifiedParams = { ...params };
    delete modifiedParams.zone;

    return super.getList(modifiedParams).pipe(
      withLatestFrom(this.store.pipe(select(configSelectors.get('serviceOfferingAvailability')))),
      map(([offeringList, offeringAvailability]) =>
        this.getOfferingsAvailableInZone(offeringList, offeringAvailability, zone),
      ),
    );
  }

  public getOfferingsAvailableInZone(
    offeringList: T[],
    offeringAvailability: ServiceOfferingAvailability,
    zone: Zone,
  ): T[] {
    if (!offeringAvailability.filterOfferings) {
      return offeringList;
    }

    return offeringList.filter(offering => {
      const offeringAvailableInZone = this.isOfferingAvailableInZone(
        offering,
        offeringAvailability,
        zone,
      );
      const localStorageCompatibility = zone.localstorageenabled || !isOfferingLocal(offering);
      return offeringAvailableInZone && localStorageCompatibility;
    });
  }

  protected abstract isOfferingAvailableInZone(
    offering: Offering,
    offeringAvailability: ServiceOfferingAvailability,
    zone: Zone,
  ): boolean;
}
