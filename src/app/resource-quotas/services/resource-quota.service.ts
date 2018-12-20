import { Injectable } from '@angular/core';
import { GatewayApiService } from '../../shared/services/gateway-api.service';
import { ResourceQuota } from '../models/resource-quota.model';
import { Observable } from 'rxjs';

@Injectable()
export class ResourceQuotaService {
  constructor(protected gatewayApiService: GatewayApiService) {}

  public getList(): Observable<ResourceQuota[]> {
    return this.gatewayApiService.execute<ResourceQuota[]>('listResourceLimits');
  }
}
