import { Injectable } from '@angular/core';

import { Config } from './config.interface';
import { defaultConfig } from './default-configuration';


@Injectable()
export class ConfigService {
  private config: Config;

  constructor() {
    this.config = defaultConfig;
  }

  public setConfig(config: Config) {
    this.config = config;
  }

  public get<T extends keyof Config>(key: T): Config[T] {
    return this.config[key as string];
  }
}
