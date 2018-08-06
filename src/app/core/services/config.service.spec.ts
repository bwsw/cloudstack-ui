import { ConfigService } from './config.service';
import { ConfigInterface, defaultConfig } from '../config';

describe('ConfigService', () => {
  let configService: ConfigService;

  beforeEach(() => {
    configService = new ConfigService();
  });

  it('should use user\'s value if it is correct (only if property has a validator)', () => {
    const config: Partial<ConfigInterface> = {
      defaultDomain: 'develop',
    };
    configService.initialize(config);
    expect(configService.get('defaultDomain')).toBe('develop');
  });

  it('should use default value if a user value is incorrect (only if property has a validator)', () => {
    const config = {
      defaultInterfaceLanguage: 'fr',
      defaultFirstDayOfWeek: 'monday',
    };
    configService.initialize(config);
    expect(configService.get('defaultInterfaceLanguage')).toBe(defaultConfig.defaultInterfaceLanguage);
    expect(configService.get('defaultFirstDayOfWeek')).toBe(defaultConfig.defaultFirstDayOfWeek);
  });

  it('should not add unknown properties', () => {
    const config = {
      noSuchProperty: true
    };
    configService.initialize(config);
    expect(configService.get('noSuchProperty' as any)).toBe(undefined);
  });

  it('should use default value if user do not provide a value', () => {
    const config = {
      defaultFirstDayOfWeek: 0
    };
    configService.initialize(config);
    expect(configService.get('defaultInterfaceLanguage')).toBe(defaultConfig.defaultInterfaceLanguage);
  });

  it('should use a default config if user do not provide a config', () => {
    configService.initialize();
    expect(configService.get('defaultInterfaceLanguage')).toBe(defaultConfig.defaultInterfaceLanguage);
    expect(configService.get('defaultFirstDayOfWeek')).toBe(defaultConfig.defaultFirstDayOfWeek);
  });

  it('should log a warning message to the console if a user\'s value is incorrect', () => {
    spyOn(console, 'warn');
    const config = {
      defaultFirstDayOfWeek: 'monday',
    };
    configService.initialize(config);
    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  it('should log a warning message to the console if a user\'s config is incorrect', () => {
    spyOn(console, 'warn');
    const config = 'defaultFirstDayOfWeek: "monday"';
    configService.initialize(config);
    expect(console.warn).toHaveBeenCalledTimes(1);
  });
});
