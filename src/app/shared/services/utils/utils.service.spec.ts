import { RouterState } from '@angular/router';
import { Utils } from './utils.service';

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
});
