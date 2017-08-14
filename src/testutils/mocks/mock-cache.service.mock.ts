class Cache {
  public get(): any {}
  public set(): void {}
}

export class MockCacheService {
  public get(): Cache {
    return new Cache();
  }

  public invalidateAll(): void {}
}
