import { Injectable } from '@angular/core';

import { ServiceOffering, ServiceOfferingAvailability, Zone } from '../models';
import { BackendResource } from '../decorators';
import { OfferingService } from './offering.service';

@Injectable()
@BackendResource({
  entity: 'ServiceOffering',
})
export class ServiceOfferingService extends OfferingService<ServiceOffering> {
  protected isOfferingAvailableInZone(
    offering: ServiceOffering,
    availability: ServiceOfferingAvailability,
    zone: Zone,
  ): boolean {
    if (availability.zones[zone.id]) {
      const isOfferingExist =
        availability.zones[zone.id].computeOfferings.indexOf(offering.id) !== -1;
      return isOfferingExist;
    }
    return false;
  }
}
