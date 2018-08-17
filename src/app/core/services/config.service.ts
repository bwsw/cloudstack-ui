import { Injectable } from '@angular/core';

import { ConfigInterface, configValidators, defaultConfig } from '../config';

enum WarnType {
  InvalidConfig,
  InvalidKey,
  InvalidValue
}

@Injectable()
export class ConfigService {
  private config: ConfigInterface;

  public initialize(json?: any) {
    if (typeof json !== 'object') {
      this.config = defaultConfig;
      this.logWarningMessage(WarnType.InvalidConfig);
    } else {
      try {
        this.mergeConfigs(json);
      } catch (e) {
        this.config = defaultConfig;
      }
    }
  }

  public get<T = any>(key: keyof ConfigInterface): T {
    return this.config[key as string];
  }

  private isValidKey(key: string) {
    return defaultConfig[key] !== undefined;
  }

  private isValidValue(key: string, value: any) {
    const validator = configValidators[key];
    return validator ? validator(value) : true;
  }

  private isValidProperty(key: string, value: any) {
    return this.isValidKey(key) && this.isValidValue(key, value);
  }

  private mergeConfigs(userConfig) {
    const userKeys = Object.keys(userConfig);

    const validUserConfig = userKeys.reduce((result, key) => {
      const isValid = this.isValidProperty(key, userConfig[key]);

      if (isValid) {
        result[key] = userConfig[key];
      } else {
        this.logInvalidParameterWarning(key, userConfig[key]);
      }
      return result;
    }, {});

    this.config = { ...defaultConfig, ...validUserConfig };
  }

  private logInvalidParameterWarning(key: string, value: any) {
    if (!this.isValidKey(key)) {
      this.logWarningMessage(WarnType.InvalidKey, key);
    } else if (!this.isValidValue(key, value)) {
      this.logWarningMessage(WarnType.InvalidValue, key);
    }
  }

  private logWarningMessage(type: WarnType, value?: string) {
    const warningType = 'Configuration warning: ';
    let message: string;

    switch (type) {
      case WarnType.InvalidConfig: {
        message = 'Incorrect configuration file structure. The default configuration is used.';
        break;
      }
      case WarnType.InvalidKey: {
        message = `Unknown configuration parameter "${value}".`;
        break;
      }
      case WarnType.InvalidValue: {
        message = `Invalid custom setting for the "${value}" property. Instead, the default value is used.`;
        break;
      }
      default: {
        message = '';
      }
    }

    console.warn(warningType + message);
  }
}
