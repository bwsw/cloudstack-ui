import { Injectable } from '@angular/core';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { Zone } from '../models/zone.model';
import { BaseBackendCachedService } from './base-backend-cached.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
@BackendResource({
  entity: 'Zone',
  entityModel: Zone
})
export class ZoneService extends BaseBackendCachedService<Zone> {
  constructor(protected http: HttpClient) {
    super(http);
  }
}
