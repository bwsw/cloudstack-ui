import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Zone } from '../models/zone.model';
import { BaseBackendService } from './base-backend.service';
import { ConfigService } from './config.service';
import { ServiceLocator } from './service-locator';
import { Offering } from '../models/offering.model';


export interface OfferingAvailability {
  [zoneId: string]: {
    filterOfferings: boolean;
    diskOfferings: Array<string>;
    serviceOfferings: Array<string>;
  };
}

@Injectable()
export abstract class OfferingService<T extends Offering> extends BaseBackendService<Offering> {
  protected configService: ConfigService;

  constructor() {
    super();
    this.configService = ServiceLocator.injector.get(ConfigService);
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

    const availabilityRequest: Observable<OfferingAvailability> = this.configService.get('offeringAvailability');
    return Observable.forkJoin([
      availabilityRequest,
      super.getList(modifiedParams)
    ])
      .map(([offeringAvailability, offeringList]) => {
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
    offering: T,
    offeringAvailability: OfferingAvailability,
    zone: Zone
  ): boolean;
}
