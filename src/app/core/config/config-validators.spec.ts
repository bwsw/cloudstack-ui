import { configValidators } from './config-validators';

describe('Config Validators', () => {
  it('should validate "defaultDomain" parameter', () => {
    const validator = configValidators.defaultDomain;
    expect(validator('domain')).toBeTruthy();
  });

  it('should validate "sessionRefreshInterval" parameter', () => {
    const validator = configValidators.sessionRefreshInterval;
    expect(validator(0)).toBeTruthy();
    expect(validator(10000)).toBeTruthy();
    expect(validator(-1)).toBeFalsy();
  });

  it('should validate "defaultFirstDayOfWeek" parameter', () => {
    const validator = configValidators.defaultFirstDayOfWeek;
    expect(validator(-1)).toBeFalsy();
    expect(validator(0)).toBeTruthy();
    expect(validator(1)).toBeTruthy();
    expect(validator(2)).toBeFalsy();
  });

  it('should validate "defaultInterfaceLanguage" parameter', () => {
    const validator = configValidators.defaultInterfaceLanguage;
    expect(validator('en')).toBeTruthy();
    expect(validator('ru')).toBeTruthy();
    expect(validator('uk')).toBeFalsy();
    expect(validator('cz')).toBeFalsy();
    expect(validator('fr')).toBeFalsy();
    expect(validator('any other string')).toBeFalsy();
  });

  it('should validate "defaultTimeFormat" parameter', () => {
    const validator = configValidators.defaultTimeFormat;
    expect(validator('hour12')).toBeTruthy();
    expect(validator('hour24')).toBeTruthy();
    expect(validator('auto')).toBeTruthy();
    expect(validator('any other string')).toBeFalsy();
  });

  it('should validate "defaultThemeName" parameter', () => {
    const validator = configValidators.defaultThemeName;
    expect(validator('blue-red')).toBeTruthy();
    expect(validator('indigo-pink')).toBeTruthy();
    expect(validator('any other string')).toBeFalsy();
  });

  it('should validate "sessionTimeout" parameter', () => {
    const validator = configValidators.sessionTimeout;
    expect(validator(-1)).toBeFalsy();
    expect(validator(0)).toBeTruthy();
    expect(validator(100)).toBeTruthy();
  });
});
