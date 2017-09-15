import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BaseModel } from '../models';
import { ApiFormat, BaseBackendService } from './base-backend.service';
import { Cache } from './cache';
import { CacheService } from './cache.service';
import { ErrorService } from './error.service';


@Injectable()
export abstract class BaseBackendCachedService<M extends BaseModel> extends BaseBackendService<M> {
  private cache: Cache<Array<M>>;

  constructor(
    http: HttpClient,
    error: ErrorService,
    cacheService: CacheService
  ) {
    super(http, error, cacheService);
    this.initDataCache();
  }

  public getList(params?: {}, customApiFormat?: ApiFormat, useCache = true): Observable<Array<M>> {
    if (useCache) {
      const cachedResult = this.cache.get(params);
      if (cachedResult) {
        return Observable.of(cachedResult);
      }
    }
    return super.getList(params, customApiFormat)
      .map(result => {
        this.cache.set({ params, result });
        return result;
      });
  }

  public create(params?: {}): Observable<any> {
    return super.create(params).do(() => this.cache.invalidate());
  }

  public remove(params?: {}): Observable<any> {
    return super.remove(params).do(() => this.cache.invalidate());
  }

  public invalidateCache(): void {
    this.cache.invalidate();
  }

  private initDataCache(): void {
    const cacheTag = `${this.entity}DataCache`;
    this.cache = this.cacheService.get<Array<M>>(cacheTag);
  }
}
