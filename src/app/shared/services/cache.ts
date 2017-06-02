import isEqual = require('lodash/isEqual');


export interface CacheEntry<T> {
  params: {};
  result: T;
}

export class Cache<T> {
  private cache: Array<CacheEntry<T>> = [];

  public get(params: {}): T {
    const hit = this.cache.find(c => {
      const paramsEqual = isEqual(params, c.params);
      const paramsUndefined = params === undefined && c.params === undefined;
      return paramsEqual || paramsUndefined;
    });

    return hit && hit.result;
  }

  public set(cacheEntry: CacheEntry<T>): void {
    this.cache.push(cacheEntry);
  }

  public invalidate(): void {
    this.cache = [];
  }
}
