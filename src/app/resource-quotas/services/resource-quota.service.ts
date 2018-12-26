import { Injectable } from '@angular/core';
import { GatewayApiService } from '../../shared/services/gateway-api.service';
import { ResourceQuota } from '../models/resource-quota.model';
import { Observable } from 'rxjs';

@Injectable()
export class ResourceQuotaService {
  constructor(protected gatewayApiService: GatewayApiService) {}

  // todo: move env and realm to some config (maybe proxy-conf.js)

  public getList(): Observable<ResourceQuota[]> {
    return this.gatewayApiService.execute('listResourceLimits', {
      env: 'development',
      realm: 'resource-limits',
    });
  }

  public updateResourceLimit(params: {
    resourceType: number;
    minimum?: number;
    maximum?: number;
  }): Observable<ResourceQuota> {
    return this.gatewayApiService.execute('updateResourceLimit', {
      ...params,
      env: 'development',
      realm: 'resource-limits',
    });
  }
}
