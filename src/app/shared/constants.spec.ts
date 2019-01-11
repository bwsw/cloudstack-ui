import { Constants } from './constants';
const xRegExp = require('xregexp');

describe('Entity Regex', () => {
  const validEntityNames = ['name1', '漢語', 'name%$#', 'name surname', 'أَلِفأَلِف', '平仮名'];
  const invalidEntityNames = [
    '%name',
    '$name',
    '&name',
    '[name',
    ']name',
    '<name',
    '>name',
    '{name',
    '}name',
    'name ',
    '!name',
    '-name',
    '(name',
    ')name',
    '_name',
    '?name',
    '~name',
    '^name',
    '#name',
    '@name',
    `'name`,
    '⏫name',
    '⚫name',
  ];

  it('should validate valid names', () => {
    const urlRegex = xRegExp(Constants.entityValidator, 'i');
    for (const validName of validEntityNames) {
      expect(urlRegex.test(validName)).toBeTruthy();
    }
  });

  it('should validate invalid names', () => {
    const urlRegex = xRegExp(Constants.entityValidator, 'i');
    for (const invalidName of invalidEntityNames) {
      expect(urlRegex.test(invalidName)).toBeFalsy();
    }
  });
});
