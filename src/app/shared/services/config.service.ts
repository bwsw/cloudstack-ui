import { Injectable } from '@angular/core';


@Injectable()
export class ConfigService {
  private config: {};

  public parse(json?: any) {
    this.config = json;
  }

  public get<T = any>(key: string | Array<string>): T {
    const isArray = Array.isArray(key);
    return this.getResult(isArray, key);
  }

  private getResult(isArray: boolean, key: string | Array<string>): any {
    if (isArray) {
      return this.getArrayResult(key as Array<string>);
    }

    return this.config[key as string];
  }

  private getArrayResult(keyArray: Array<string>): object {
    const result = {};

    for (const key in this.config) {
      if (this.config.hasOwnProperty(key) && keyArray.indexOf(key) !== -1) {
        result[key] = this.config[key];
      }
    }

    return result;
  }
}
