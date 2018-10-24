import { MemoryStorageService } from './memory-storage.service';
import { Injectable } from '@angular/core';
import { Utils } from './utils/utils.service';

@Injectable()
export class LocalStorageService extends MemoryStorageService {
  public localStorage: Storage;
  private isLocalStorage: boolean;

  constructor() {
    super();

    this.localStorage = localStorage;
    this.isLocalStorage = this.isLocalStorageAvailable();
  }

  public write(key: string, value: string): void {
    this.isLocalStorage ? this.localStorage.setItem(key, value) : super.write(key, value);
  }

  public read(key: string): string {
    const result = this.isLocalStorage ? this.localStorage.getItem(key) : super.read(key);

    return result !== 'undefined' ? result : undefined;
  }

  public remove(key: string): void {
    this.isLocalStorage ? this.localStorage.removeItem(key) : super.remove(key);
  }

  public reset() {
    if (this.isLocalStorage) {
      this.localStorage.clear();
    }
  }

  private isLocalStorageAvailable(): boolean {
    if (!localStorage) {
      return false;
    }

    try {
      const uniq = Utils.getUniqueId();
      this.localStorage.setItem(uniq, uniq);
      this.localStorage.removeItem(uniq);
      return true;
    } catch (e) {
      return false;
    }
  }
}
