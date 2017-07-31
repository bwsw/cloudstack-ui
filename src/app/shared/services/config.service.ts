import { Injectable } from '@angular/core';
import { SecurityGroup } from '../../security-group/sg.model';


interface IConfig {
  securityGroupTemplates: Array<SecurityGroup>;
}


@Injectable()
export class ConfigService {
  private config: IConfig;

  public get(key: string | Array<string>): any | Array<any> {
    const isArray = Array.isArray(key);
    this.getResult(isArray, key)
  }

  private getResult(isArray: boolean, key: string | Array<string>): any {
    return isArray ? this.getArrayResult(key as Array<string>) : this.config[key as string];
  }

  private getArrayResult(keyArray: Array<string>): Object {
    const result = {};

    for (const key in this.config) {
      if (this.config.hasOwnProperty(key) && keyArray.includes(key)) {
        result[key] = this.config[key];
      }
    }

    return result;
  }
}
