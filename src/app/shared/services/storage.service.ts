import { Injectable } from '@angular/core';
import { TagService } from './tag.service';
import { Observable } from 'rxjs';
import { ResourceTypes } from '../models/tag.model';
import { UtilsService } from './utils.service';


export interface IStorageService {
  writeLocal(key: string, value: string): void;
  readLocal(key: string): string;
  removeLocal(key: string): void;
  writeRemote(key: string, value: string): Observable<void>;
  readRemote(key: string): Observable<string>;
  removeRemote(key: string): Observable<void>;
}

@Injectable()
export class StorageService implements IStorageService {
  private isLocalStorage: boolean;
  private inMemoryStorage: Object;

  constructor(
    private tagService: TagService,
    private utils: UtilsService
  ) {
    this.isLocalStorage = this.isLocalStorageAvailable;
    if (!this.isLocalStorage) {
      this.inMemoryStorage = {};
    }
  }

  public writeLocal(key: string, value: string): void {
    this.isLocalStorage ? this.localStorageWrite(key, value) : this.inMemoryWrite(key, value);
  }

  public readLocal(key: string): string {
    return this.isLocalStorage ? this.localStorageRead(key) : this.inMemoryRead(key);
  }

  public removeLocal(key: string): void {
    this.isLocalStorage ? this.localStorageRemove(key) : this.inMemoryRemove(key);
  }

  public writeRemote(key: string, value: string): Observable<void> {
    const user = { id: this.readLocal('userId') };
    if (!user.id) {
      return Observable.of(null);
    }
    return this.tagService.update(user, 'User', key, value);
  }

  public readRemote(key: string): Observable<string> {
    const user = { id: this.readLocal('userId') };
    if (!user.id) {
      return Observable.of(null);
    }
    return this.tagService.getTag(user, key).map(tag => tag ? tag.value : undefined);
  }

  public removeRemote(key: string): Observable<void> {
    let userId = this.readLocal('userId');
    if (!userId) {
      return;
    }
    return this.tagService.remove({
      resourceIds: userId,
      resourceType: ResourceTypes.USER,
      'tags[0].key': key
    });
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
