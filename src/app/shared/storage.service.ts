import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

  public write(key: any, value: any): void {
    localStorage.setItem(key, value);
  }

  public read(key: any): any {
    return localStorage.getItem(key);
  }

  public remove(key: any): void {
    localStorage.removeItem(key);
  }
}
