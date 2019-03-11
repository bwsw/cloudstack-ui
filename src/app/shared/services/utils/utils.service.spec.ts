import { RouterState } from '@angular/router';
import { Utils } from './utils.service';
import timeFormatConverterExamples from './time-format-converter-examples';
import { Language, TimeFormat } from '../../types';

const divideFixture = [
  {
    enumerator: 1,
    denominator: 3,
    exponent: 2,
    precision: 2,
    result: 0.11,
  },
];

const convertToGbFixture = [
  {
    bytes: 1073741824,
    gb: 1,
  },
];

const matchLowerFixture = [
  {
    string: 'ACS',
    subString: 'acs',
    result: true,
  },
  {
    string: 'TestString',
    subString: 'abc',
    result: false,
  },
];

const getRouteWithoutQueryParamsFixture = [
  {
    routerState: {
      snapshot: {
        url: '/path?queryParam1=test1&queryParam2=test2',
      },
    },
    routeWithoutParams: '/path',
  },
  {
    routerState: {
      snapshot: {
        url: '/path',
      },
    },
    routeWithoutParams: '/path',
  },
  {
    routerState: {
      snapshot: {
        url: '/',
      },
    },
    routeWithoutParams: '/',
  },
  {
    routerState: {
      snapshot: {
        url: '/path?',
      },
    },
    routeWithoutParams: '/path',
  },
];

describe('Utils service', () => {
  it('should generate unique id', () => {
    expect(Utils.getUniqueId()).toBeDefined();
  });

  it('should divide', () => {
    divideFixture.forEach(example => {
      expect(
        Utils.divide(example.enumerator, example.denominator, example.exponent, example.precision),
      ).toBe(example.result);
    });
  });

  it('should convert bytes to GB', () => {
    expect(Utils.convertToGb(undefined)).toBe(0);

    convertToGbFixture.forEach(example => {
      expect(Utils.convertToGb(example.bytes)).toBe(example.gb);
    });
  });

  it('should match strings up to lower case', () => {
    matchLowerFixture.forEach(example => {
      expect(Utils.matchLower(example.string, example.subString)).toBe(example.result);
    });
  });

  it('should create route without query params', () => {
    expect(Utils.getRouteWithoutQueryParams(undefined)).toBe('/');

    getRouteWithoutQueryParamsFixture.forEach(example => {
      expect(Utils.getRouteWithoutQueryParams(example.routerState as RouterState)).toBe(
        example.routeWithoutParams,
      );
    });
  });

  it('should convert boolean string to boolean', () => {
    expect(Utils.convertBooleanStringToBoolean('true')).toBe(true);
    expect(Utils.convertBooleanStringToBoolean('false')).toBe(false);
    expect(Utils.convertBooleanStringToBoolean('test')).toBeUndefined();
  });

  it('should convert boolean to boolean string', () => {
    expect(Utils.convertBooleanToBooleanString(true)).toBe('true');
    expect(Utils.convertBooleanToBooleanString(false)).toBe('false');

    expect(Utils.convertBooleanToBooleanString(null)).toBe('false');

    expect(Utils.convertBooleanToBooleanString(undefined)).toBe('false');
  });

  it('should check if color is dark', () => {
    let color = '#AEAEAE';
    expect(Utils.isColorDark(color)).toBeFalsy();

    color = '#000000';
    expect(Utils.isColorDark(color)).toBeTruthy();
  });

  it('should convert AM/PM to 24 and 24 to AM/PM', () => {
    timeFormatConverterExamples.forEach(({ hour12, hour24 }) => {
      expect(Utils.convertAmPmTo24(hour12)).toEqual(hour24);
    });

    expect(
      Utils.convertAmPmTo24({
        hour: 20,
        minute: 0,
      }),
    ).toEqual({
      hour: 20,
      minute: 0,
    });
  });

  it('should convert 24 to AM/PM', () => {
    timeFormatConverterExamples.forEach(({ hour12, hour24 }) => {
      expect(Utils.convert24ToAmPm(hour24)).toEqual(hour12);
    });

    expect(
      Utils.convert24ToAmPm({
        hour: 8,
        minute: 0,
        period: 1,
      }),
    ).toEqual({
      hour: 8,
      minute: 0,
      period: 1,
    });
  });

  describe('getMomentLongDateFormat', () => {
    it('should return format for ru + hour12', () => {
      expect(Utils.getMomentLongDateFormat(Language.ru, TimeFormat.hour12)).toEqual({
        LT: 'h:mm A',
        LTS: 'h:mm:ss A',
        L: 'DD.MM.YYYY',
        LL: 'D MMMM YYYY г.',
        LLL: 'D MMMM YYYY г., LT',
        LLLL: 'dddd, D MMMM YYYY г., LT',
      });
    });
    it('should return format for ru + hour24', () => {
      expect(Utils.getMomentLongDateFormat(Language.ru, TimeFormat.hour24)).toEqual({
        LT: 'H:mm',
        LTS: 'H:mm:ss',
        L: 'DD.MM.YYYY',
        LL: 'D MMMM YYYY г.',
        LLL: 'D MMMM YYYY г., LT',
        LLLL: 'dddd, D MMMM YYYY г., LT',
      });
    });
    it('should return format for ru + auto', () => {
      expect(Utils.getMomentLongDateFormat(Language.ru, TimeFormat.AUTO)).toEqual({
        LT: 'H:mm',
        LTS: 'H:mm:ss',
        L: 'DD.MM.YYYY',
        LL: 'D MMMM YYYY г.',
        LLL: 'D MMMM YYYY г., LT',
        LLLL: 'dddd, D MMMM YYYY г., LT',
      });
    });
    it('should return format for en + hour12', () => {
      expect(Utils.getMomentLongDateFormat(Language.en, TimeFormat.hour12)).toEqual({
        LT: 'h:mm A',
        LTS: 'h:mm:ss A',
        L: 'MM/DD/YYYY',
        LL: 'MMMM Do YYYY',
        LLL: 'MMMM Do YYYY LT',
        LLLL: 'dddd, MMMM Do YYYY LT',
      });
    });
    it('should return format for en + hour24', () => {
      expect(Utils.getMomentLongDateFormat(Language.en, TimeFormat.hour24)).toEqual({
        LT: 'H:mm',
        LTS: 'H:mm:ss',
        L: 'MM/DD/YYYY',
        LL: 'MMMM Do YYYY',
        LLL: 'MMMM Do YYYY LT',
        LLLL: 'dddd, MMMM Do YYYY LT',
      });
    });
    it('should return format for en + auto', () => {
      expect(Utils.getMomentLongDateFormat(Language.en, TimeFormat.AUTO)).toEqual({
        LT: 'h:mm A',
        LTS: 'h:mm:ss A',
        L: 'MM/DD/YYYY',
        LL: 'MMMM Do YYYY',
        LLL: 'MMMM Do YYYY LT',
        LLLL: 'dddd, MMMM Do YYYY LT',
      });
    });
  });

  describe('encodeStringToBase64', () => {
    it('should return valid encoded string', () => {
      const data = 'some data';
      const expected = btoa(data);
      expect(Utils.encodeStringToBase64(data)).toEqual(expected);
    });

    it('should return null for no data', () => {
      expect(Utils.encodeStringToBase64('')).toBeNull();
    });
  });

  describe('decodeStringFromBase64', () => {
    it('should return valid data', () => {
      const data = 'some data';
      expect(Utils.decodeStringFromBase64(btoa(data))).toEqual(data);
    });
    it('should return null for no data', () => {
      expect(Utils.decodeStringFromBase64('')).toBeNull();
    });
  });

  describe('sizeOfBase64String', () => {
    it('should return 0 for empty string', () => {
      expect(Utils.sizeOfBase64String('')).toEqual(0);
    });

    it('should return size of base64 string', () => {
      expect(Utils.sizeOfBase64String(Utils.encodeStringToBase64('some string'))).toEqual(23);
    });
  });
});
