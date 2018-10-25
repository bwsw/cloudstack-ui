export abstract class StorageService {
  public storage: Storage | Object;

  public abstract write(key: string, value: string): void;

  public abstract read(key: string): string;

  public abstract remove(key: string): void;

  public abstract reset(): void;
}
