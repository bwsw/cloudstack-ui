import { Injectable } from '@angular/core';
import { ServiceOffering } from '../models/service-offering.model';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { DiskOffering } from '../models/disk-offering.model';
import { BaseModel } from '../models/base.model';
import { BaseBackendService } from './base-backend.service';


export interface OfferingAvailability {
  [zoneId: string]: {
    filterOfferings: boolean;
    diskOfferings: Array<string>;
    serviceOfferings: Array<string>;
  };
}

@Injectable()
export abstract class OfferingService<T extends BaseModel> extends BaseBackendService<BaseModel> {
  constructor(protected configService: ConfigService) {
    super();
  }

  public get(id: string): Observable<T> {
    return super.get(id);
  }

  public getList(params?: any): Observable<Array<T>> {
    let availabilityObservable: Observable<OfferingAvailability> = this.configService.get('offeringAvailability');
    let zoneId;

    if (params && params.zoneId) {
      zoneId = params.zoneId;
      delete params.zoneId;
    } else {
      return super.getList(params);
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
        if (!params || params.local === undefined) {
          return list;
        }
        return list.filter(offering => offering.isLocal === params.local);
      })
  }

  protected abstract isOfferingAvailableInZone(
    offering: ServiceOffering | DiskOffering,
    offeringAvailability: OfferingAvailability,
    zoneId: string
  ): boolean;
}
