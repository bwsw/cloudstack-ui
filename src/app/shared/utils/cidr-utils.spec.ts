import { CidrUtils } from './cidr-utils';
import { IPVersion } from '../../security-group/sg.model';

const validCidrV4Values = ['99.198.122.146/32', '46.51.197.88/8', '173.194.34.134/12', '0.0.0.0/0'];
const validCidrV6Values = [
  'fe80:0000:0000:0000:0204:61ff:fe9d:f156/100',
  '::1/128',
  'a:b:c:d:e:f:0::/64',
  'FE80::/10',
];
const invalidCidrValues = [
  'invalid',
  '',
  ' ',
  null,
  // IP v4
  '.100.100.100.100/16',
  '100.100.100.100./32',
  'http://123.123.123/28',
  '1000.2.3.4/14',
  '0.0.0.0',
  // IP v6
  'fe80:0000:0000:0000:0204:61ff:fe9d:f156/129',
  '1::5:400.2.3.4/64',
  '2001:0000:1234:0000:0000:C1C0:ABCD:0876  0/64',
  '1.2.3.4::/64',
  '::',
  ':::/64',
  '::2222:3333:4444:5555:7777:8888::/64',
];

describe('CIDR Utils', () => {
  it('should check if CIDR v4 valid', () => {
    for (const value of validCidrV4Values) {
      expect(CidrUtils.isCidrV4Valid(value)).toBe(true);
    }
    for (const value of invalidCidrValues) {
      expect(CidrUtils.isCidrV4Valid(value)).toBe(false);
    }
  });

  it('should check if CIDR v6 valid', () => {
    for (const value of validCidrV6Values) {
      expect(CidrUtils.isCidrV6Valid(value)).toBe(true);
    }
    for (const value of invalidCidrValues) {
      expect(CidrUtils.isCidrV6Valid(value)).toBe(false);
    }
  });

  it('should check if CIDR (v4 or v6) valid', () => {
    const validCidrValues = [...validCidrV4Values, ...validCidrV6Values];
    for (const value of validCidrValues) {
      expect(CidrUtils.isCidrValid(value)).toBe(true);
    }
    for (const value of invalidCidrValues) {
      expect(CidrUtils.isCidrValid(value)).toBe(false);
    }
  });

  it('should return proper CIDR IP version', () => {
    for (const value of validCidrV4Values) {
      expect(CidrUtils.getCidrIpVersion(value)).toBe(IPVersion.ipv4);
    }
    for (const value of validCidrV6Values) {
      expect(CidrUtils.getCidrIpVersion(value)).toBe(IPVersion.ipv6);
    }
    for (const value of invalidCidrValues) {
      expect(CidrUtils.getCidrIpVersion(value)).toBe(null);
    }
  });
});
