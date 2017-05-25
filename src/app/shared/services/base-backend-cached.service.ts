import { Observable } from 'rxjs/Observable';
import { BaseModel } from '../models';
import { CacheService } from './';
import { BaseBackendService } from './base-backend.service';
import { Cache } from './cache.service';
import { ServiceLocator } from './service-locator';


export abstract class BaseBackendCachedService<M extends BaseModel> extends BaseBackendService<M> {
  private cache: Cache<Array<M>>;

  constructor() {
    super();
    this.cache = ServiceLocator.injector.get(CacheService).get<Array<M>>(this.entity);
  }

  public getList(params?: {}): Observable<Array<M>> {
    const cachedResult = this.cache.get(params);
    if (cachedResult) {
      return Observable.of(cachedResult);
    } else {
      return super.getList(params)
        .map(result => {
          this.cache.set({ params, result });
          return result;
        });
    }
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
}
