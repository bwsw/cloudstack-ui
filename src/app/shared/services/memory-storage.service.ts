import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';

@Injectable()
export class MemoryStorageService implements StorageService {
  public storage = {};

  public write(key: string, value: string): void {
    this.storage[key] = value;
  }

  public read(key: string): string {
    const result = this.storage[key];
    return result !== 'undefined' ? result : undefined;
  }

  public remove(key: string): void {
    delete this.storage[key];
  }

  public reset() {
    this.storage = {};
  }
}
