import { Injectable } from '@angular/core';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { DiskOffering } from '../models/disk-offering.model';
import {
  OfferingAvailability,
  OfferingService
} from './offering.service';
import { Observable } from 'rxjs/Observable';
import { Zone } from '../models/zone.model';
import { Volume } from '../models/volume.model';


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

  public isOfferingAvailableForVolume(diskOffering: DiskOffering, volume: Volume, zone: Zone): boolean {
    return !diskOffering.isLocal || zone.localStorageEnabled &&
      (diskOffering.isCustomized || diskOffering.id !== volume.diskOfferingId);
  }

  protected isOfferingAvailableInZone(
    offering: DiskOffering,
    offeringAvailability: OfferingAvailability,
    zone: Zone
  ): boolean {
    return offeringAvailability[zone.id].diskOfferings.includes(offering.id);
  }
}
