import { ConfigValidationService } from './config-validation.service';
import { defaultConfig } from './default-configuration';
import { Config } from '../../shared/models/config';

describe('ConfigValidationService', () => {
  let configValidationService: ConfigValidationService;

  beforeEach(() => {
    configValidationService = new ConfigValidationService();
    spyOn(console, 'warn').and.stub();
  });

  it('should return a config with all properties', () => {
    const conf = configValidationService.validate({});

    const configKeys = Object.keys(defaultConfig);
    for (const key of configKeys) {
      expect(conf[key]).not.toBeUndefined();
    }
  });

  it("should merge user's value if it is correct (only if property has a validator) to resulted config", () => {
    const config: Partial<Config> = {
      defaultDomain: 'develop',
    };
    const conf = configValidationService.validate(config);
    expect(conf.defaultDomain).toBe('develop');
  });

  it("should not merge user's value if it is incorrect (only if property has a validator) to resulted config", () => {
    const config = {
      defaultInterfaceLanguage: 'fr',
      defaultFirstDayOfWeek: 'monday',
    };
    const conf = configValidationService.validate(config);
    expect(conf.defaultInterfaceLanguage).toBe(defaultConfig.defaultInterfaceLanguage);
    expect(conf.defaultFirstDayOfWeek).toBe(defaultConfig.defaultFirstDayOfWeek);
  });

  it('should ignore non-customizable properties', () => {
    const config = {
      showSystemTags: !defaultConfig.showSystemTags,
    };
    const conf = configValidationService.validate(config);
    expect(conf.showSystemTags).toBe(defaultConfig.showSystemTags);
  });

  it('should not add unknown properties', () => {
    const config = {
      noSuchProperty: true,
    };
    const conf = configValidationService.validate(config);
    expect(conf['noSuchProperty']).toBeUndefined();
  });

  it('should use default value if user do not provide a value', () => {
    const config = {};
    const conf = configValidationService.validate(config);
    expect(conf.defaultInterfaceLanguage).toBe(defaultConfig.defaultInterfaceLanguage);
  });

  it("should log a warning message to the console if a user's key is unknown", () => {
    const config = {
      noSuchProperty: true,
    };
    configValidationService.validate(config);
    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  it("should log a warning message to the console if a user's value is incorrect", () => {
    const config = {
      defaultFirstDayOfWeek: 'monday',
    };
    configValidationService.validate(config);
    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  it("should log a warning message to the console if a user's config is incorrect", () => {
    const config = 'defaultFirstDayOfWeek: "monday"';
    configValidationService.validate(config);
    expect(console.warn).toHaveBeenCalledTimes(1);
  });
});
