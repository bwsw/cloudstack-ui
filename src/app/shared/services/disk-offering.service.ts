import { Injectable } from '@angular/core';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { DiskOffering } from '../models/disk-offering.model';
import { OfferingAvailability, OfferingService } from './offering.service';
import { Observable } from 'rxjs/Observable';
import { Zone } from '../models/zone.model';
import { Volume } from '../models/volume.model';
import { isOfferingLocal } from '../models/offering.model';

@Injectable()
@BackendResource({
  entity: 'DiskOffering'
})
export class DiskOfferingService extends OfferingService<DiskOffering> {
  public getList(params?: any): Observable<Array<DiskOffering>> {
    return super.getList(params)
      .map(list => {
        if (!params || !params.maxSize) {
          return list;
        }

        return list.filter((offering: DiskOffering) => {
          return offering.disksize < params.maxSize || offering.iscustomized;
        });
      });
  }

  public isOfferingAvailableForVolume(diskOffering: DiskOffering, volume: Volume, zone: Zone): boolean {
    return !isOfferingLocal(diskOffering) || zone.localstorageenabled &&
      (diskOffering.iscustomized || diskOffering.id !== volume.diskofferingid);
  }

  protected isOfferingAvailableInZone(
    offering: DiskOffering,
    offeringAvailability: OfferingAvailability,
    zone: Zone
  ): boolean {
    return offeringAvailability[zone.id].diskOfferings.indexOf(offering.id) !== -1;
  }
}
