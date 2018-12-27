import { Injectable } from '@angular/core';
import { GatewayApiService } from '../../shared/services/gateway-api.service';
import { ResourceQuota } from '../models/resource-quota.model';
import { Observable } from 'rxjs';

// todo: move env and realm to some config (maybe proxy-conf.js)
const pluginConfig = {
  env: 'development',
  realm: 'resource-limits',
};

@Injectable()
export class ResourceQuotaService {
  constructor(protected gatewayApiService: GatewayApiService) {}

  public getList(): Observable<ResourceQuota[]> {
    return this.gatewayApiService.execute('listResourceLimits', pluginConfig);
  }

  public updateResourceLimit(params: {
    resourceType: number;
    minimum?: number;
    maximum?: number;
  }): Observable<ResourceQuota> {
    return this.gatewayApiService.execute('updateResourceLimit', {
      ...params,
      ...pluginConfig,
    });
  }

  public updateResource(params: { resourceType: number; max: number }): Observable<void> {
    return this.gatewayApiService.execute('updateResource', {
      ...params,
      ...pluginConfig,
    });
  }
}
