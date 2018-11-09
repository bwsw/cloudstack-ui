import { Injectable } from '@angular/core';
import * as AjvCore from 'ajv';
import * as AjvUniqueItemProperties from 'ajv-keywords/keywords/uniqueItemProperties';
import * as AjvErrors from 'ajv-errors';
import * as omit from 'lodash/omit';

import { Config } from '../../shared/models/config';
import { customizableProperties, defaultConfig } from './default-configuration';
import * as validationSchemes from './validation-schemes';

enum ErrorType {
  InvalidConfig,
  InvalidKey,
  InvalidValue,
}

abstract class ValidationError {
  protected constructor(readonly type: ErrorType, readonly message: string) {}

  public getErrorText(): string {
    return `Configuration warning:\n${this.message}`;
  }
}

class InvalidConfigError extends ValidationError {
  constructor() {
    const message = 'Incorrect configuration file structure.\nThe default configuration is used.';
    super(ErrorType.InvalidConfig, message);
  }
}

class InvalidKeyError extends ValidationError {
  readonly key: string;

  constructor(key: string) {
    const message = `Unknown configuration property "${key}".`;
    super(ErrorType.InvalidKey, message);
    this.key = key;
  }
}

class InvalidValueError extends ValidationError {
  readonly key: string;

  constructor(key: string, message: string) {
    const extendedMessage = `"${key}" property: ${message}.\nThe default value is used.`;
    super(ErrorType.InvalidValue, extendedMessage);
    this.key = key;
  }
}

type ValidationScheme = { readonly [P in keyof Partial<Config>]: object };

@Injectable()
export class ConfigValidationService {
  private readonly schemeValidator: AjvCore.Ajv;
  private readonly schemeMap: ValidationScheme = {
    defaultDomain: validationSchemes.defaultDomain,
    apiDocLink: validationSchemes.apiDocLink,
    sessionRefreshInterval: validationSchemes.sessionRefreshInterval,
    extensions: validationSchemes.extensions,
    vmColors: validationSchemes.vmColors,
    defaultFirstDayOfWeek: validationSchemes.defaultFirstDayOfWeek,
    defaultInterfaceLanguage: validationSchemes.defaultInterfaceLanguage,
    defaultTimeFormat: validationSchemes.defaultTimeFormat,
    defaultTheme: validationSchemes.defaultTheme,
    defaultComputeOffering: validationSchemes.defaultComputeOffering,
    sessionTimeout: validationSchemes.sessionTimeout,
    customComputeOfferingParameters: validationSchemes.customComputeOfferingParameters,
    serviceOfferingAvailability: validationSchemes.serviceOfferingAvailability,
    imageGroups: validationSchemes.imageGroups,
    computeOfferingClasses: validationSchemes.computeOfferingClasses,
    defaultSecurityGroupName: validationSchemes.defaultSecurityGroupName,
    offeringCompatibilityPolicy: validationSchemes.offeringCompatibilityPolicy,
    securityGroupTemplates: validationSchemes.securityGroupTemplates,
  };

  constructor() {
    // Ajv options allErrors and jsonPointers are required for ajv-errors
    this.schemeValidator = new AjvCore({ allErrors: true, jsonPointers: true });
    AjvErrors(this.schemeValidator);
    AjvUniqueItemProperties(this.schemeValidator);
  }

  public validate(userConfig: any): Config {
    if (typeof userConfig !== 'object') {
      this.printError(new InvalidConfigError());
      return defaultConfig;
    }

    const errors = this.getValidationErrors(userConfig);
    this.printErrors(errors);
    const fixedConfig = this.getFixedConfig(userConfig, errors);

    return { ...defaultConfig, ...fixedConfig };
  }

  private getValidationErrors(userConf: object) {
    const userConfKeys = Object.keys(userConf);
    const errors: ValidationError[] = [];

    for (const key of userConfKeys) {
      if (!this.isValidKey(key)) {
        errors.push(new InvalidKeyError(key));
      } else if (!this.isValidValue(key, userConf[key])) {
        errors.push(new InvalidValueError(key, this.schemeValidator.errorsText()));
      }
    }

    return errors;
  }

  private isValidKey(key: string) {
    return customizableProperties[key] !== undefined;
  }

  private isValidValue(key: string, value: any) {
    const scheme = this.schemeMap[key];
    return this.schemeValidator.validate(scheme, value);
  }

  private getFixedConfig(userConf: object, errors: ValidationError[]): Partial<Config> {
    const confWithoutUnknownProps = this.removeUnknownProperties(userConf, errors);

    const valueErrors = this.getValueErrors(errors);
    const confWithValidProps = valueErrors.reduce((dictionary, error) => {
      dictionary[error.key] = defaultConfig[error.key];
      return dictionary;
    }, {});

    return { ...confWithoutUnknownProps, ...confWithValidProps };
  }

  private removeUnknownProperties(userConf: object, errors: ValidationError[]): object {
    const keysOfKeyErrors: string[] = this.getKeyErrors(errors).map(error => error.key);
    return omit(userConf, keysOfKeyErrors);
  }

  private getKeyErrors(errors: ValidationError[]): InvalidKeyError[] {
    return errors.filter(error => error.type === ErrorType.InvalidKey) as InvalidKeyError[];
  }

  private getValueErrors(errors: ValidationError[]): InvalidValueError[] {
    return errors.filter(error => error.type === ErrorType.InvalidValue) as InvalidValueError[];
  }

  private printErrors(errors: ValidationError[]) {
    for (const error of errors) {
      this.printError(error);
    }
  }

  private printError(error: ValidationError) {
    console.warn(error.getErrorText());
  }
}
