import removeNullsAndEmptyArrays from './remove-nulls-and-empty-arrays';

describe('removeNullsAndEmptyArrays', () => {
  it('should remove nulls', () => {
    expect(
      removeNullsAndEmptyArrays({
        a: 1,
        b: null,
        c: [1],
      }),
    ).toEqual({
      a: 1,
      c: [1],
    });
  });

  it('should remove empty arrays', () => {
    expect(
      removeNullsAndEmptyArrays({
        a: 1,
        b: [],
      }),
    ).toEqual({
      a: 1,
    });
  });
});
