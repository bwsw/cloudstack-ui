import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Offering } from '../models/offering.model';
import { Zone } from '../models/zone.model';
import { BaseBackendService } from './base-backend.service';
import { CacheService } from './cache.service';
import { ConfigService } from './config.service';
import { ErrorService } from './error.service';


export interface OfferingAvailability {
  [zoneId: string]: {
    filterOfferings: boolean;
    diskOfferings: Array<string>;
    serviceOfferings: Array<string>;
  };
}

@Injectable()
export abstract class OfferingService<T extends Offering> extends BaseBackendService<T> {
  constructor(
    http: HttpClient,
    error: ErrorService,
    cacheService: CacheService,
    private configService: ConfigService
  ) {
    super(http, error, cacheService);
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

    const offeringAvailability = this.configService.get('offeringAvailability');

    return super.getList(modifiedParams)
      .map(offeringList => {
        return this.getOfferingsAvailableInZone(
          offeringList,
          offeringAvailability,
          zone
        );
      });
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
        const offeringAvailableInZone = this.isOfferingAvailableInZone(offering, offeringAvailability, zone);
        const localStorageCompatibility = zone.localStorageEnabled || !offering.isLocal;
        return offeringAvailableInZone && localStorageCompatibility;
      });
  }

  protected abstract isOfferingAvailableInZone(
    offering: Offering,
    offeringAvailability: OfferingAvailability,
    zone: Zone
  ): boolean;
}
