import { Injectable } from '@angular/core';
import { ServiceOffering } from '../models/service-offering.model';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { OfferingService, OfferingAvailability } from './offering.service';


@Injectable()
@BackendResource({
  entity: 'ServiceOffering',
  entityModel: ServiceOffering
})
export class ServiceOfferingService extends OfferingService<ServiceOffering> {
  protected isOfferingAvailableInZone(
    offering: ServiceOffering,
    offeringAvailability: OfferingAvailability,
    zoneId: string
  ): boolean {
    return offeringAvailability[zoneId].serviceOfferings.includes(offering.id);
  }
}
