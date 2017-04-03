import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { StorageService } from './storage.service';

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
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storage: StorageService
  ) { }

  public init(key: string, paramsWhitelist: FilterConfig): any {
    return this.getParams(key, paramsWhitelist);
  }

  public update(key, params): void {
    const queryParams = {};
    for (let field in params) {
      if (params.hasOwnProperty(field)) {
        const val = params[field];
        if (Array.isArray(val) && !val.length) {
          continue;
        }
        queryParams[field] = val;
      }
    }
    this.router.navigate([], { queryParams })
      .then(() => this.storage.write(key, JSON.stringify(queryParams)));
  }

  private getParams(key: string, config: FilterConfig): any {
    const queryParams = this.route.snapshot.queryParams;
    const output = {};
    const missingFilters = [];

    for (let filter in config) {
      if (!config.hasOwnProperty(filter)) {
        continue;
      }
      const param = queryParams[filter];
      if (param === undefined) {
        missingFilters.push(filter);
        continue;
      }

      const val = FilterService.getValue(param, config[filter]);
      if (val != null) {
        output[filter] = val;
      } else {
        missingFilters.push(filter);
      }
    }
    if (!missingFilters.length) {
      return output;
    }

    const storageParams = this.storage.read(key);
    if (!storageParams) {
      missingFilters.forEach(filter => FilterService.setDefaultIfSpecified(filter, config, output));
      return output;
    }
    let storage;
    try {
      storage = JSON.parse(storageParams);
    } catch (e) {
      this.storage.remove(key);
      return output;
    }

    missingFilters.forEach(filter => {
      const val = FilterService.getValue(storage[filter], config[filter]);
      if (val != null) {
        output[filter] = val;
      } else {
        FilterService.setDefaultIfSpecified(filter, config, output);
      }
    });

    return output;
  }

  private static setDefaultIfSpecified(filter, config: FilterConfig, output): void {
    if (config[filter].defaultOption) {
        output[filter] = config[filter].defaultOption;
    }
  }

  private static getValue(param, conf: FilterItemConfig): any {
    if (param == null) {
      return param;
    }

    switch (conf.type) {
      case 'boolean': {
        if (typeof param === 'boolean') {
          return param;
        }
        if (param === 'true') {
          return true;
        } else if (param === 'false') {
          return false;
        }
      } break;
      case 'string': {
        if (!conf.options || (conf.options && conf.options.some(_ => _ === param))) {
          return param.toString();
        }
      } break;
      case 'array': {
        let par = param;
        if (typeof param === 'string') {
          par = param.split(',');
        } else if (!Array.isArray(param)) {
          break;
        }
        if (!conf.options || (conf.options && par.every(p => conf.options.some(_ => _ === p)))) {
          return par;
        }
      }
    }
    return null;
  }
}
