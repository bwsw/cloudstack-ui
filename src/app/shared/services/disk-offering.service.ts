import { Injectable } from '@angular/core';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { DiskOffering } from '../models/disk-offering.model';
import { OfferingService, OfferingAvailability } from './offering.service';


@Injectable()
@BackendResource({
  entity: 'DiskOffering',
  entityModel: DiskOffering
})
export class DiskOfferingService extends OfferingService<DiskOffering> {
  protected isOfferingAvailableInZone(
    offering: DiskOffering,
    offeringAvailability: OfferingAvailability,
    zoneId: string
  ): boolean {
    return offeringAvailability[zoneId].diskOfferings.includes(offering.id);
  }
}
