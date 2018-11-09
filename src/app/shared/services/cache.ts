export interface CacheEntry<T> {
  params: {};
  result: T;
}

export class Cache<T> {
  private cache: { [key: string]: T } = {};

  public get(params: {}): T {
    const key = JSON.stringify(params);
    return this.cache[key];
  }

  public set(cacheEntry: CacheEntry<T>): void {
    const key = JSON.stringify(cacheEntry.params);
    this.cache[key] = cacheEntry.result;
  }

  public invalidate(): void {
    this.cache = {};
  }
}
