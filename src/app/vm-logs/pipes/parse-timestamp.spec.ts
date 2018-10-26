import { ParseTimestampPipe } from './parse-timestamp.pipe';

describe('parse timestamp pipe', () => {
  const parseTimestamp = new ParseTimestampPipe();

  it('should extract base path', () => {
    const date = parseTimestamp.transform('2018-10-11T02:21:00.783Z');
    expect(date.getFullYear()).toBe(2018);
    expect(date.getMonth()).toBe(9);
    expect(date.getDate()).toBe(11);
  });
});
