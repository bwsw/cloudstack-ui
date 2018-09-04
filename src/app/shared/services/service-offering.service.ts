import { Injectable } from '@angular/core';
import { ServiceOffering, Zone } from '../models';
import { BackendResource } from '../decorators';
import { OfferingAvailability, OfferingService } from './offering.service';

@Injectable()
@BackendResource({
  entity: 'ServiceOffering'
})
export class ServiceOfferingService extends OfferingService<ServiceOffering> {
  protected isOfferingAvailableInZone(
    offering: ServiceOffering,
    availability: OfferingAvailability,
    zone: Zone
  ): boolean {
    if (availability.zones[zone.id]) {
      const isOfferingExist = availability.zones[zone.id].serviceOfferings.indexOf(offering.id) !== -1;
      return isOfferingExist;
    }
    return false;
  }
}
