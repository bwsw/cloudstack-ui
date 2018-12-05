import { ActivatedRoute, Router } from '@angular/router';
import { Serializer } from '../utils/serializer';
import { StorageService } from './storage.service';
import { Utils } from './utils/utils.service';

export interface FilterConfig {
  [propName: string]: FilterItemConfig;
}

export interface FilterItemConfig {
  type: 'array' | 'string' | 'boolean';
  options?: any[];
  defaultOption?: any;
}

export class FilterService {
  constructor(
    private config: FilterConfig,
    private router: Router,
    private storage: StorageService,
    private key: string,
    private activatedRoute: ActivatedRoute,
  ) {}

  public update(params): void {
    if (Utils.getRouteWithoutQueryParams(this.router.routerState) === '/login') {
      return;
    }

    const queryParams = Serializer.encode(params);

    this.router
      .navigate([], { queryParams })
      .then(() => this.storage.write(this.key, JSON.stringify(queryParams)));
  }

  public getParams(): any {
    const queryParams = this.activatedRoute.snapshot.queryParams;

    let storage = {};
    try {
      storage = JSON.parse(this.storage.read(this.key)) || {};
    } catch (e) {
      this.storage.remove(this.key);
    }

    return Serializer.decode([queryParams, storage], this.config);
  }
}
