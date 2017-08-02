export abstract class StorageService {
  public storage: Storage | Object;

  public abstract write(key: string, value: string): void;

  public abstract read(key: string): string ;

  public abstract remove(key: string): void;
}

export class MemoryStorageService implements StorageService {
  public storage = {};

  public write(key: string, value: string): void {
    if (this.storage instanceof Storage) {
      this.storage.setItem(key, value);
    } else {
      this.storage[key] = value;
    }
  }

  public read(key: string): string {
    let result;
    if (this.storage instanceof Storage) {
      result = this.storage.getItem(key);
    } else {
      result = this.storage[key];
    }
    return result !== 'undefined' ? result : undefined;
  }

  public remove(key: string): void {
    if (this.storage instanceof Storage) {
      this.storage.removeItem(key)
    } else {
      delete this.storage[key];
    }
  }

  public reset() {
    if (this.storage instanceof Storage) {
      this.storage.clear();
    } else {
      this.storage = {};
    }
  }
}

export class SessionStorageService extends MemoryStorageService {
  public storage = sessionStorage;
}

export class LocalStorageService extends MemoryStorageService {
  public storage = localStorage;
}
