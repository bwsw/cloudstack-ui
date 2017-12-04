import { Injectable } from '@angular/core';
import { BackendResource } from '../decorators';
import { Zone } from '../models';
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
