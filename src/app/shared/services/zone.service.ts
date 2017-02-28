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
  private basic: boolean;

  constructor() {
    super();
  }

  public areAllZonesBasic(): Observable<boolean> {
    if (typeof this.basic === 'undefined') {
      return this.getList()
        .map(zoneList => {
          this.basic = zoneList.every(zone => !zone.securityGroupsEnabled);
          return this.basic;
        });
    } else {
      return Observable.of(this.basic);
    }
  }
}
