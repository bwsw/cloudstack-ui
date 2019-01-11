import { Injectable } from '@angular/core';
import { GatewayApiService } from '../../shared/services/gateway-api.service';
import { ResourceQuota } from '../models/resource-quota.model';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { configSelectors, State } from '../../root-store';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class ResourceQuotaService {
  readonly pluginConfig$ = this.store.pipe(select(configSelectors.get('resourceLimits')));

  constructor(private store: Store<State>, private gatewayApiService: GatewayApiService) {}

  public getList(): Observable<ResourceQuota[]> {
    return this.pluginConfig$.pipe(
      switchMap(pluginConfig => {
        return this.gatewayApiService.execute('listResourceLimits', pluginConfig);
      }),
    );
  }

  public updateResourceLimit(params: {
    resourceType: number;
    minimum?: number;
    maximum?: number;
  }): Observable<ResourceQuota> {
    return this.pluginConfig$.pipe(
      switchMap(pluginConfig => {
        return this.gatewayApiService.execute('updateResourceLimit', {
          ...params,
          ...pluginConfig,
        });
      }),
    );
  }

  public updateResource(params: { resourceType: number; max: number }): Observable<void> {
    return this.pluginConfig$.pipe(
      switchMap(pluginConfig => {
        return this.gatewayApiService.execute('updateResource', {
          ...params,
          ...pluginConfig,
        });
      }),
    );
  }
}
