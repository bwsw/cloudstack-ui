import { Injectable } from '@angular/core';
import { Cache } from './cache';


export interface CacheStorage {
  [token: string]: Cache<any>;
}

@Injectable()
export class CacheService {
  private caches: CacheStorage = {};

  public get<T>(token: string): Cache<T> {
    if (!this.caches[token]) {
      this.caches[token] = new Cache<T>();
    }
    return this.caches[token];
  }

  public invalidateAll(): void {
    Object.keys(this.caches).forEach(c => this.caches[c].invalidate());
    this.caches = {};
  }
}
