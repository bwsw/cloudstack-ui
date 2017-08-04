import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from './storage.service';
import { Utils } from './utils.service';
import { Injectable } from '@angular/core';

export interface FilterConfig {
  [propName: string]: FilterItemConfig;
}

export interface FilterItemConfig {
  type: 'array' | 'string' | 'boolean';
  options?: Array<any>;
  defaultOption?: any;
}

@Injectable()
export class FilterService {
  private static setDefaultOrRemove(filter, config: FilterConfig, output): void {
    if (config[filter].defaultOption) {
      output[filter] = config[filter].defaultOption;
    } else {
      delete output[filter];
    }
  }

  private static getValue(param, conf: FilterItemConfig): any {
    let res;
    if (param != null) {
      switch (conf.type) {
        case 'boolean':
          if (typeof param === 'boolean' || param === 'true' || param === 'false') {
            res = JSON.parse(param);
          }
          break;
        case 'string':
          if (!conf.options || conf.options.some(_ => _ === param)) {
            res = param.toString();
          }
          break;
        case 'array':
          let par = param;
          if (typeof param === 'string') {
            par = param.split(',');
          } else if (!Array.isArray(param)) {
            break;
          }
          if (!conf.options) {
            res = par;
          } else {
            res = par.filter(p => conf.options.some(_ => _ === p));
          }
          break;
      }
    }
    return res;
  }

  constructor(
    private router: Router,
    private storage: StorageService
  ) {}

  public init(key: string, paramsWhitelist: FilterConfig, route: ActivatedRoute): any {
    return this.getParams(key, paramsWhitelist, route);
  }

  public update(key, params): void {
    if (Utils.getRouteWithoutQueryParams(this.router.routerState) === '/login') {
      return;
    }

    const queryParams = Object.keys(params).reduce((memo, field) => {
      if (params.hasOwnProperty(field)) {
        const val = params[field];
        if (!Array.isArray(val) || val.length) {
          memo[field] = val;
        }
        return memo;
      }
    }, {});
    this.router.navigate([], { queryParams })
      .then(() => this.storage.write(key, JSON.stringify(queryParams)));
  }

  private getParams(key: string, config: FilterConfig, route: ActivatedRoute): any {
    const queryParams = route.snapshot.queryParams;

    let storage = {};
    try {
      storage = JSON.parse(this.storage.read(key)) || {};
    } catch (e) {
      this.storage.remove(key);
    }

    return Object.keys(config).reduce((memo, filter) => {
      const param = queryParams[filter];
      if (config.hasOwnProperty(filter)) {
        memo[filter] = FilterService.getValue(param, config[filter]);
      }

      if (memo[filter] == null && storage.hasOwnProperty(filter)) {
        memo[filter] = FilterService.getValue(
          storage[filter],
          config[filter]
        );
      }

      if (memo[filter] == null) {
        FilterService.setDefaultOrRemove(filter, config, memo);
      }

      return memo;
    }, {});
  }
}
