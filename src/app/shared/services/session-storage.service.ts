import { MemoryStorageService } from './memory-storage.service';
import { Injectable } from '@angular/core';
import { Utils } from './utils/utils.service';

@Injectable()
export class SessionStorageService extends MemoryStorageService {
  public sessionStorage: Storage;
  private isSessionStorage: boolean;

  constructor() {
    super();

    this.sessionStorage = sessionStorage;
    this.isSessionStorage = this.isSessionStorageAvailable();
  }

  public write(key: string, value: string): void {
    this.isSessionStorage ? this.sessionStorage.setItem(key, value) : super.write(key, value);
  }

  public read(key: string): string {
    const result = this.isSessionStorage ? this.sessionStorage.getItem(key) : super.read(key);

    return result !== 'undefined' ? result : undefined;
  }

  public remove(key: string): void {
    this.isSessionStorage ? this.sessionStorage.removeItem(key) : super.remove(key);
  }

  public reset() {
    if (this.isSessionStorage) {
      this.sessionStorage.clear();
    }
  }

  private isSessionStorageAvailable(): boolean {
    if (!sessionStorage) {
      return false;
    }

    try {
      const uniq = Utils.getUniqueId();
      this.sessionStorage.setItem(uniq, uniq);
      this.sessionStorage.removeItem(uniq);
      return true;
    } catch (e) {
      return false;
    }
  }
}
