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
    this.router.navigate([], { queryParams: params })
      .then(() => this.storage.write(key, JSON.stringify(params)));
  }

  private getParams(key: string, config: FilterConfig): any {
    const queryParams = this.route.snapshot.queryParams;
    const output = {};
    const missingParams = [];

    for (let filter in config) {
      if (!config.hasOwnProperty(filter)) {
        continue;
      }
      const param = queryParams[filter];
      if (!param) {
        missingParams.push(filter);
        continue;
      }

      const val = FilterService.getValue(param, config[filter]);
      if (val != null) {
        output[filter] = val;
      } else {
        missingParams.push(filter);
      }
    }
    if (!missingParams.length) {
      return output;
    }

    const storageParams = this.storage.read(key);
    if (!storageParams) {
      return output;
    }
    let storage;
    try {
      storage = JSON.parse(storageParams);
    } catch (e) {
      this.storage.remove(key);
      return output;
    }

    missingParams.forEach(param => {
      const val = FilterService.getValue(storage[param], config[param]);
      if (val != null) {
        output[param] = val;
      } else if (config[param].defaultOption) {
        output[param] = config[param].defaultOption;
      }
    });

    return output;
  }


  private static getValue(param, conf: FilterItemConfig): any {
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
