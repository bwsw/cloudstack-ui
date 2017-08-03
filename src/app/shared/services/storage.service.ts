import { Injectable } from '@angular/core';
import { Utils } from './utils.service';


@Injectable()
export class StorageService {
  private isLocalStorage: boolean;
  private inMemoryStorage: Object;
  protected overrideStorage: Storage;

  constructor() {
    this.init();
  }

  public write(key: string, value: string): void {
    this.isLocalStorage ? this.storageWrite(key, value) : this.inMemoryWrite(key, value);
  }

  public read(key: string): string {
    return this.isLocalStorage ? this.storageRead(key) : this.inMemoryRead(key);
  }

  public remove(key: string): void {
    this.isLocalStorage ? this.storageRemove(key) : this.inMemoryRemove(key);
  }

  public resetInMemoryStorage(): void {
    this.inMemoryStorage = undefined;
  }

  protected storageWrite(key: string, value: string): void {
    this.overrideStorage.setItem(key, value);
  }

  protected storageRead(key: string): string {
    const result = this.overrideStorage.getItem(key);
    return result !== 'undefined' ? result : undefined;
  }

  protected storageRemove(key: string): void {
    this.overrideStorage.removeItem(key);
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

  protected init() {
    this.isLocalStorage = this.isLocalStorageAvailable;
    if (!this.isLocalStorage) {
      this.inMemoryStorage = {};
    }
  }

  private get isLocalStorageAvailable(): boolean {
    if (!localStorage) {
      return false;
    }

    try {
      const uniq = Utils.getUniqueId();
      this.storageWrite(uniq, uniq);
      this.storageRemove(uniq);
      return true;
    } catch (e) {
      return false;
    }
  }
}
