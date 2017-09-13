import { Utils } from './utils.service';


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

  it('should get route without query params', () => {

  });
});
