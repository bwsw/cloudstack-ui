import { Injectable } from '@angular/core';

export interface IStorageService {
  write(key: string, value: string): void;
  read(key: string): string;
  remove(key: string): void;
}

@Injectable()
export class StorageService implements IStorageService {
  public write(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  public read(key: string): string {
    return localStorage.getItem(key);
  }

  public remove(key: string): void {
    localStorage.removeItem(key);
  }
}
