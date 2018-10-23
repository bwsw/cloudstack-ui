import { HttpUrlEncodingCodec } from '@angular/common/http';
import { CustomQueryEncoder } from './custom-query-encoder';

describe('Custom query encoder', () => {
  let encoder: HttpUrlEncodingCodec;

  beforeEach(() => {
    encoder = new CustomQueryEncoder();
  });

  it('should not url encode special characters', () => {
    const specialCharacters = ['@', ':', '$', ',', ';', '=', '?'].join('');
    expect(encoder.encodeKey(specialCharacters)).toBe(specialCharacters);
    expect(encoder.encodeValue(specialCharacters)).toBe(specialCharacters);
  });

  it('should encode +', () => {
    expect(encoder.encodeKey('+')).toBe('%2B');
    expect(encoder.encodeValue('+')).toBe('%2B');
  });

  it('should encode /', () => {
    expect(encoder.encodeKey('/')).toBe('%2F');
    expect(encoder.encodeValue('/')).toBe('%2F');
  });
});
