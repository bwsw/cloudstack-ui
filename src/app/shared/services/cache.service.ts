import { Cache } from './cache';

export interface CacheStorage {
  [token: string]: Cache<any>;
}

const caches: CacheStorage = {};

export class CacheService {
  public static create<T>(token: string): Cache<T> {
    if (!caches[token]) {
      caches[token] = new Cache<T>();
    }
    return caches[token];
  }

  public static invalidateAll(): void {
    Object.keys(caches).forEach(c => caches[c].invalidate());
  }
}
