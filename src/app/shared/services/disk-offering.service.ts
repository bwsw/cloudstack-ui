import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BackendResource } from '../decorators';
import { OfferingService } from './offering.service';
import { DiskOffering, Volume, Zone } from '../models';
import { isOfferingLocal } from '../models/offering.model';
import { OfferingAvailability } from '../models/config';

@Injectable()
@BackendResource({
  entity: 'DiskOffering'
})
export class DiskOfferingService extends OfferingService<DiskOffering> {
  public getList(params?: any): Observable<Array<DiskOffering>> {
    return super.getList(params)
      .map(list => {
        if (!params || params.maxSize === 'Unlimited' || !params.maxSize ) {
          return list;
        } else {
          return list.filter((offering: DiskOffering) => {
            return offering.disksize < params.maxSize || offering.iscustomized;
          });
        }
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
    if (offeringAvailability.zones[zone.id]) {
      const isOfferingExist = offeringAvailability.zones[zone.id].diskOfferings.indexOf(offering.id) !== -1;
      return isOfferingExist;
    }
    return false;
  }
}
