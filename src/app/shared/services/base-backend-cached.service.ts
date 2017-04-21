import { Observable } from 'rxjs/Observable';
import isEqual = require('lodash/isEqual');

import { BaseModel } from '../models';
import { BaseBackendService } from './base-backend.service';


interface ICache<M> {
  params: {};
  result: Array<M>;
}

export abstract class BaseBackendCachedService<M extends BaseModel> extends BaseBackendService<M> {
  protected cache: Array<ICache<M>>;

  constructor() {
    super();
    this.cache = [];
  }

  public getList(params?: {}): Observable<Array<M>> {
    for (let i = 0; i < this.cache.length; i++) {
      if (isEqual(params, this.cache[i].params)) {
        return Observable.of(this.cache[i].result);
      }
    }

    return super.getList(params)
      .map(result => {
        this.cache.push({ params, result });
        return result;
      });
  }

  public create(params?: {}): Observable<any> {
    this.invalidateCache();
    return super.create(params);
  }

  public remove(params?: {}): Observable<any> {
    this.invalidateCache();
    return super.remove(params);
  }

  protected invalidateCache(): void {
    this.cache = [];
  }
}
