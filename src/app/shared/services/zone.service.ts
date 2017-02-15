import { Injectable } from '@angular/core';
import { Zone } from '../models/zone.model';
import { BaseBackendCachedService } from './base-backend-cached.service';
import { BackendResource } from '../decorators/backend-resource.decorator';


@Injectable()
@BackendResource({
  entity: 'Zone',
  entityModel: Zone
})
export class ZoneService extends BaseBackendCachedService<Zone> { }
