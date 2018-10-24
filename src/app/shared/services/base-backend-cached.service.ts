import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { BaseModel } from '../models';
import { ApiFormat, BaseBackendService } from './base-backend.service';
import { Cache } from './cache';
import { CacheService } from './cache.service';

export abstract class BaseBackendCachedService<M extends BaseModel> extends BaseBackendService<M> {
  private cache: Cache<M[]>;

  constructor(http: HttpClient) {
    super(http);
    this.initDataCache();
  }

  public getList(params?: {}, customApiFormat?: ApiFormat, useCache = true): Observable<M[]> {
    if (useCache) {
      const cachedResult = this.cache.get(params);
      if (cachedResult) {
        return of(cachedResult);
      }
    }
    return super.getList(params, customApiFormat).pipe(
      map(result => {
        this.cache.set({ params, result });
        return result;
      }),
    );
  }

  public create(params?: {}): Observable<any> {
    return super.create(params).pipe(tap(() => this.invalidateCache()));
  }

  public remove(params?: {}): Observable<any> {
    return super.remove(params).pipe(tap(() => this.invalidateCache()));
  }

  public invalidateCache(): void {
    this.cache.invalidate();
  }

  private initDataCache(): void {
    const cacheTag = `${this.entity}DataCache`;
    this.cache = CacheService.create<M[]>(cacheTag);
  }
}
