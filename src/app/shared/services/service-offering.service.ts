import { Injectable } from '@angular/core';
import { ServiceOffering } from '../models/service-offering.model';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { OfferingService, OfferingAvailability } from './offering.service';
import { Observable } from 'rxjs';


@Injectable()
@BackendResource({
  entity: 'ServiceOffering',
  entityModel: ServiceOffering
})
export class ServiceOfferingService extends OfferingService<ServiceOffering> {
  public getList(params?: any): Observable<Array<ServiceOffering>> {
    if (!params || !params.zoneId || !params.local) {
      return super.getList(params);
    }

    return super.getList(params).map(serviceOfferings => {
      return serviceOfferings.filter(serviceOffering => serviceOffering.isLocal === params.local);
    });
  }

  protected isOfferingAvailableInZone(
    offering: ServiceOffering,
    offeringAvailability: OfferingAvailability,
    zoneId: string
  ): boolean {
    return offeringAvailability[zoneId].serviceOfferings.includes(offering.id);
  }
}
