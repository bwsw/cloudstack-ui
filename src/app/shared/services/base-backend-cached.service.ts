import { Observable } from 'rxjs/Observable';
import { BaseModel } from '../models';
import { ApiFormat, CacheService } from './';
import { BaseBackendService } from './base-backend.service';
import { Cache } from './cache';
import { ServiceLocator } from './service-locator';


export abstract class BaseBackendCachedService<M extends BaseModel> extends BaseBackendService<M> {
  private cache: Cache<Array<M>>;

  constructor() {
    super();
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
    this.cache = ServiceLocator.injector
      .get(CacheService)
      .get<Array<M>>(cacheTag);
  }
}
