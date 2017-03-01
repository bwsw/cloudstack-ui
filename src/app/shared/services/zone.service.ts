import { Injectable } from '@angular/core';
import { Zone } from '../models/zone.model';
import { BaseBackendCachedService } from './base-backend-cached.service';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { Observable } from 'rxjs';


@Injectable()
@BackendResource({
  entity: 'Zone',
  entityModel: Zone
})
export class ZoneService extends BaseBackendCachedService<Zone> {
  // a basic zone is a zone that doesn't support security groups
  private allZonesAreBasic: boolean;

  public areAllZonesBasic(): Observable<boolean> {
    if (this.allZonesAreBasic === undefined) {
      return this.getList()
        .map(zoneList => {
          this.allZonesAreBasic = zoneList.every(zone => !zone.securityGroupsEnabled);
          return this.allZonesAreBasic;
        });
    }
    return Observable.of(this.allZonesAreBasic);
  }
}
