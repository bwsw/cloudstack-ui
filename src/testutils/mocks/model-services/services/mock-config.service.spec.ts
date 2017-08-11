import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class MockConfigService {
  constructor(@Inject('mockConfigServiceConfig') public config: { value: any }) {}

  public get<T = any>(key: string | Array<string>): T {
    if (!Array.isArray(key)) {
      return this.config.value[key];
    }

    const result = {};
    for (const configKey in this.config.value) {
      if (this.config.value.hasOwnProperty(configKey) && key.includes(configKey)) {
        result[configKey] = this.config.value[configKey];
      }
    }
    return result as T;
  }
}
