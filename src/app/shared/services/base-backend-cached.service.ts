import { BaseModel } from '../models/base.model';
import { BaseBackendService } from './base-backend.service';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';


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
      if (_.isEqual(params, this.cache[i].params)) {
        return Observable.of(this.cache[i].result);
      }
    }
    return this.fetchList(params)
      .map(res => {
        if (!res) { return []; }
        const result = res.map(m => this.prepareModel(m)) as Array<M>;
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
