import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BaseModelInterface } from '../models';
import { ApiFormat, BaseBackendService } from './base-backend.service';
import { Cache } from './cache';
import { CacheService } from './cache.service';


export abstract class BaseBackendCachedService<M extends BaseModelInterface> extends BaseBackendService<M> {
  private cache: Cache<Array<M>>;

  constructor(http: HttpClient) {
    super(http);
    this.initDataCache();
  }

  public getList(
    params?: {},
    customApiFormat?: ApiFormat,
    useCache = true
  ): Observable<Array<M>> {
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
    return super.create(params).do(() => this.invalidateCache());
  }

  public remove(params?: {}): Observable<any> {
    return super.remove(params)
      .do(() => this.invalidateCache());
  }

  public invalidateCache(): void {
    this.cache.invalidate();
  }

  private initDataCache(): void {
    const cacheTag = `${this.entity}DataCache`;
    this.cache = CacheService.create<Array<M>>(cacheTag);
  }
}
