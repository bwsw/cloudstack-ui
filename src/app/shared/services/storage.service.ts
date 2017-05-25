import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';


@Injectable()
export class StorageService {
  private isLocalStorage: boolean;
  private inMemoryStorage: Object;

  constructor(private utils: UtilsService) {
    this.isLocalStorage = this.isLocalStorageAvailable;
    if (!this.isLocalStorage) {
      this.inMemoryStorage = {};
    }
  }

  public write(key: string, value: string): void {
    this.isLocalStorage ? this.localStorageWrite(key, value) : this.inMemoryWrite(key, value);
  }

  public read(key: string): string {
    return this.isLocalStorage ? this.localStorageRead(key) : this.inMemoryRead(key);
  }

  public remove(key: string): void {
    this.isLocalStorage ? this.localStorageRemove(key) : this.inMemoryRemove(key);
  }

  private localStorageWrite(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  private localStorageRead(key: string): string {
    let result = localStorage.getItem(key);
    return result !== 'undefined' ? result : undefined;
  }

  private localStorageRemove(key: string): void {
    localStorage.removeItem(key);
  }

  private inMemoryWrite(key: string, value: string): void {
    this.inMemoryStorage[key] = value;
  }

  private inMemoryRead(key: string): string {
    return this.inMemoryStorage[key] || null;
  }

  private inMemoryRemove(key: string): void {
    delete this.inMemoryStorage[key];
  }

  private get isLocalStorageAvailable(): boolean {
    if (!localStorage) {
      return false;
    }

    try {
      const uniq = this.utils.getUniqueId();
      this.localStorageWrite(uniq, uniq);
      this.localStorageRemove(uniq);
      return true;
    } catch (e) {
      return false;
    }
  }
}
