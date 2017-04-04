import { Injectable } from '@angular/core';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { DiskOffering } from '../models/disk-offering.model';
import { OfferingService, OfferingAvailability } from './offering.service';
import { Observable } from 'rxjs';


@Injectable()
@BackendResource({
  entity: 'DiskOffering',
  entityModel: DiskOffering
})
export class DiskOfferingService extends OfferingService<DiskOffering> {
  public getList(params?: any): Observable<Array<DiskOffering>> {
    return super.getList(params)
      .map(list => {
        if (!params || !params.maxSize) {
          return list;
        }

        return list.filter(offering => {
          return offering.diskSize < params.maxSize || offering.isCustomized;
        });
      });
  }

  protected isOfferingAvailableInZone(
    offering: DiskOffering,
    offeringAvailability: OfferingAvailability,
    zoneId: string
  ): boolean {
    return offeringAvailability[zoneId].diskOfferings.includes(offering.id);
  }
}
