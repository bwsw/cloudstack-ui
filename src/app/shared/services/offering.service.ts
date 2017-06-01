import { Injectable } from '@angular/core';
import { ServiceOffering } from '../models/service-offering.model';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from './config.service';
import { DiskOffering } from '../models/disk-offering.model';
import { BaseModel } from '../models/base.model';
import { BaseBackendService } from './base-backend.service';
import { Zone } from '../models/zone.model';
import { ServiceLocator } from './service-locator';


export interface OfferingAvailability {
  [zoneId: string]: {
    filterOfferings: boolean;
    diskOfferings: Array<string>;
    serviceOfferings: Array<string>;
  };
}

@Injectable()
export abstract class OfferingService<T extends BaseModel> extends BaseBackendService<BaseModel> {
  protected configService: ConfigService;

  constructor() {
    super();
    this.configService = ServiceLocator.injector.get(ConfigService);
  }

  public get(id: string): Observable<T> {
    return super.get(id);
  }

  public getList(params?: any): Observable<Array<T>> {
    const availabilityObservable: Observable<OfferingAvailability> = this.configService.get('offeringAvailability');
    let zoneId;
    let zoneLocal;

    if (!params || !params.zone) {
      return super.getList(params);
    } else {
      zoneId = params.zone.id;
      zoneLocal = params.zone.localStorageEnabled;
      delete params.zone;
    }

    return Observable.forkJoin([
      availabilityObservable,
      super.getList(params)
    ])
      .map(([offeringAvailability, list]) => {
        if (!offeringAvailability.filterOfferings) {
          return list;
        }
        return list.filter(offering => {
          return this.isOfferingAvailableInZone(offering, offeringAvailability, zoneId);
        });
      })
      .map(list => {
        if (!zoneId) {
          return list;
        }
        return list.filter(offering => zoneLocal || !offering.isLocal);
      });
  }

  protected abstract isOfferingAvailableInZone(
    offering: ServiceOffering | DiskOffering,
    offeringAvailability: OfferingAvailability,
    zone: Zone
  ): boolean;
}
