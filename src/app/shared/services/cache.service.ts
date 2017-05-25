import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import isEqual = require('lodash/isEqual');


export interface CacheEntry<T> {
  params: {};
  result: T;
}

export interface CacheStorage {
  [token: string]: Cache<any>;
}

@Injectable()
export class CacheService {
  private caches: CacheStorage = {};

  constructor(private authService: AuthService) {
    this.authService.loggedIn.subscribe(() => {
      this.invalidateAll();
    });
  }

  public get<T>(token: string): Cache<T> {
    this.caches[token] = new Cache<T>();
    return this.caches[token];
  }

  public invalidateAll(): void {
    for (let c in this.caches) {
      if (this.caches.hasOwnProperty(c)) {
        this.caches[c].invalidate();
      }
    }

    this.caches = {};
  }
}

export class Cache<T> {
  private cache: Array<CacheEntry<T>> = [];

  public get(params: {}): T {
    for (let i = 0; i < this.cache.length; i++) {
      const paramsEqual = isEqual(params, this.cache[i].params);
      const paramsUndefined = params === undefined && this.cache[i].params === undefined;
      if (paramsEqual || paramsUndefined) {
        return this.cache[i].result;
      }
    }

    return undefined;
  }

  public set(cacheEntry: CacheEntry<T>): void {
    this.cache.push(cacheEntry);
  }

  public invalidate(): void {
    this.cache = [];
  }
}
