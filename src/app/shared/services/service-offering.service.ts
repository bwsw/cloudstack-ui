import { Injectable } from '@angular/core';
import { ServiceOffering } from '../models/service-offering.model';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { OfferingService, OfferingAvailability } from './offering.service';
import { Zone } from '../models/zone.model';


@Injectable()
@BackendResource({
  entity: 'ServiceOffering',
  entityModel: ServiceOffering
})
export class ServiceOfferingService extends OfferingService<ServiceOffering> {
  protected isOfferingAvailableInZone(
    offering: ServiceOffering,
    offeringAvailability: OfferingAvailability,
    zone: Zone
  ): boolean {
    return offeringAvailability[zone.id].serviceOfferings.includes(offering.id);
  }
}
