import { Injectable } from '@angular/core';
import { GatewayApiService } from '../../shared/services/gateway-api.service';
import { ResourceQuota } from '../models/resource-quota.model';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { configSelectors, State } from '../../root-store';
import { switchMap } from 'rxjs/operators';
import { ResourceLimit } from '../../shared/models';

const isNumber = require('lodash/isNumber');

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

  public updateResourceLimits(
    resourceQuotas: {
      resourceType: number;
      minimum?: number;
      maximum?: number;
    }[],
  ): Observable<ResourceQuota[]> {
    const params = resourceQuotas.reduce((memo, { resourceType, minimum, maximum }) => {
      if (isNumber(minimum)) {
        memo[`minimum${resourceType}`] = minimum;
      }
      if (isNumber(maximum)) {
        memo[`maximum${resourceType}`] = maximum;
      }
      return memo;
    }, {});
    return this.pluginConfig$.pipe(
      switchMap(pluginConfig => {
        return this.gatewayApiService.execute('updateResourceLimits', {
          ...params,
          ...pluginConfig,
        });
      }),
    );
  }

  public updateResources(
    resourceLimits: { resourceType: number; max: number }[],
  ): Observable<ResourceLimit[]> {
    const params = resourceLimits.reduce((memo, { resourceType, max }) => {
      return { ...memo, [`limit${resourceType}`]: max };
    }, {});
    return this.pluginConfig$.pipe(
      switchMap(pluginConfig => {
        return this.gatewayApiService.execute('updateResources', {
          ...params,
          ...pluginConfig,
        });
      }),
    );
  }
}
