import { RouterState } from '@angular/router';
import { Utils } from './utils.service';
import { IPVersion } from '../../../security-group/sg.model';


const divideFixture = [
  {
    enumerator: 1,
    denominator: 3,
    exponent: 2,
    precision: 2,
    result: 0.11
  }
];

const convertToGbFixture = [
  {
    bytes: 1073741824,
    gb: 1
  }
];

const matchLowerFixture = [
  {
    string: 'ACS',
    subString: 'acs',
    result: true
  },
  {
    string: 'TestString',
    subString: 'abc',
    result: false
  }
];

const getRouteWithoutQueryParamsFixture = [
  {
    routerState: {
      snapshot: {
        url: '/path?queryParam1=test1&queryParam2=test2'
      }
    },
    routeWithoutParams: '/path'
  },
  {
    routerState: {
      snapshot: {
        url: '/path'
      }
    },
    routeWithoutParams: '/path'
  },
  {
    routerState: {
      snapshot: {
        url: '/'
      }
    },
    routeWithoutParams: '/'
  },
  {
    routerState: {
      snapshot: {
        url: '/path?'
      }
    },
    routeWithoutParams: '/path'
  }
];

describe('Utils service', () => {
  it('should generate unique id', () => {
    expect(Utils.getUniqueId()).toBeDefined();
  });

  it('should divide', () => {
    divideFixture.forEach(example => {
      expect(Utils.divide(
        example.enumerator,
        example.denominator,
        example.exponent,
        example.precision
      ))
        .toBe(example.result);
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
      expect(Utils.getRouteWithoutQueryParams(example.routerState as RouterState))
        .toBe(example.routeWithoutParams);
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

    expect(() => Utils.convertBooleanToBooleanString(null))
      .toThrowError('Invalid argument');

    expect(() => Utils.convertBooleanToBooleanString(undefined))
      .toThrowError('Invalid argument');
  });

  it('should check if color is dark', () => {
    let color = '#AEAEAE';
    expect(Utils.isColorDark(color)).toBeFalsy();

    color = '#000000';
    expect(Utils.isColorDark(color)).toBeTruthy();
  });

  it('should check if CIDR valid', () => {
    const validValues = [
      // IP v4
      '99.198.122.146/32',
      '46.51.197.88/8',
      '173.194.34.134/12',
      '0.0.0.0/0',
      // IP v6
      'fe80:0000:0000:0000:0204:61ff:fe9d:f156/100',
      '::1/128',
      'a:b:c:d:e:f:0::/64',
      'FE80::/10'
    ];
    const invalidValues = [
      'invalid',
      '',
      ' ',
      '0.0.0.0',
      '::/',
      null,
      // IP v4
      '.100.100.100.100/16',
      '100.100.100.100./32',
      'http://123.123.123/28',
      '1000.2.3.4/14',
      // IP v6
      'fe80:0000:0000:0000:0204:61ff:fe9d:f156/129',
      '1::5:400.2.3.4/64',
      '2001:0000:1234:0000:0000:C1C0:ABCD:0876  0/64',
      '1.2.3.4::/64',
      ':::/64',
      '::2222:3333:4444:5555:7777:8888::/64'
    ];

    for (const value of validValues) {
      expect(Utils.cidrIsValid(value)).toBe(true);
    }
    for (const value of invalidValues) {
      expect(Utils.cidrIsValid(value)).toBe(false);
    }
  });

  it('should return proper CIDR type', () => {
    const validV4Values = [
      '99.198.122.146/32',
      '46.51.197.88/8',
      '173.194.34.134/12',
      '0.0.0.0/0'
    ];
    const validV6Values = [
      'fe80:0000:0000:0000:0204:61ff:fe9d:f156/100',
      '::1/128',
      'a:b:c:d:e:f:0::/64',
      'FE80::/10'
    ];
    const invalidValues = [
      'invalid',
      '',
      ' ',
      null,
      // IP v4
      '.100.100.100.100/16',
      '100.100.100.100./32',
      'http://123.123.123/28',
      '1000.2.3.4/14',
      // IP v6
      'fe80:0000:0000:0000:0204:61ff:fe9d:f156/129',
      '1::5:400.2.3.4/64',
      '2001:0000:1234:0000:0000:C1C0:ABCD:0876  0/64',
      '1.2.3.4::/64',
      ':::/64',
      '::2222:3333:4444:5555:7777:8888::/64'
    ];

    for (const value of validV4Values) {
      expect(Utils.cidrType(value)).toBe(IPVersion.ipv4);
    }
    for (const value of validV6Values) {
      expect(Utils.cidrType(value)).toBe(IPVersion.ipv6);
    }
    for (const value of invalidValues) {
      expect(Utils.cidrType(value)).toBe(null);
    }
  })
});
