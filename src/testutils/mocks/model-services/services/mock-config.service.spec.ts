import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class MockConfigService {
  constructor(@Inject('mockConfigServiceConfig') public config: { value: any }) {}

  public get(key: string | Array<string>): Observable<any | Array<any>> {
    if (!Array.isArray(key)) {
      return Observable.of(this.config.value[key]);
    }

    const result = {};
    for (const configKey in this.config.value) {
      if (this.config.value.hasOwnProperty(configKey) && key.includes(configKey)) {
        result[configKey] = this.config.value[configKey];
      }
    }
    return Observable.of(result);
  }
}
