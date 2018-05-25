import { Truncate } from './truncate';

describe('Truncate Class', () => {
  const evenString = '12345678';
  const oddString = '123456789';
  const evenQuote = 'In teaching others we teach ourselves';
  const oddQuote = 'Be not afraid of going slowly, be afraid only of standing still';

  it('should perform Mac-Style truncation (even desired length)', () => {
    const truncatedEvenString = Truncate.macStyle(evenString, 6);
    const truncatedOddString = Truncate.macStyle(oddString, 6);
    const truncatedEvenQuote = Truncate.macStyle(evenQuote, 12);
    const truncatedOddQuote = Truncate.macStyle(oddQuote, 12);
    expect(truncatedEvenString).toBe('12...8');
    expect(truncatedOddString).toBe('12...9');
    expect(truncatedEvenQuote).toBe('In te...lves');
    expect(truncatedOddQuote).toBe('Be no...till');
  });

  it('should perform Mac-Style truncation (odd desired length)', () => {
    const truncatedEvenString = Truncate.macStyle(evenString, 7);
    const truncatedOddString = Truncate.macStyle(oddString, 7);
    const truncatedEvenQuote = Truncate.macStyle(evenQuote, 13);
    const truncatedOddQuote = Truncate.macStyle(oddQuote, 13);
    expect(truncatedEvenString).toBe('12...78');
    expect(truncatedOddString).toBe('12...89');
    expect(truncatedEvenQuote).toBe('In te...elves');
    expect(truncatedOddQuote).toBe('Be no...still');
  });

  it('should perform ellipsis-style truncation', () => {
    const truncatedEvenString = Truncate.ellipsis(evenString, 6);
    const truncatedOddString = Truncate.ellipsis(oddString, 7);
    const truncatedEvenQuote = Truncate.ellipsis(evenQuote, 12);
    const truncatedOddQuote = Truncate.ellipsis(oddQuote, 13);
    expect(truncatedEvenString).toBe('123...');
    expect(truncatedOddString).toBe('1234...');
    expect(truncatedEvenQuote).toBe('In teachi...');
    expect(truncatedOddQuote).toBe('Be not afr...');
  });

  it('should perform clip-style truncation', () => {
    const truncatedEvenString = Truncate.clip(evenString, 6);
    const truncatedOddQuote = Truncate.clip(oddQuote, 13);
    expect(truncatedEvenString).toBe('123456');
    expect(truncatedOddQuote).toBe('Be not afraid');
  });
});
