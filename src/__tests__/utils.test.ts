import { CPF_FIRST_MULTIPLIERS } from '../constants';
import {
  calculateCheckDigit,
  stringToDigitArray,
  removeNonDigits,
  areAllDigitsSame,
} from '../utils';
import { CPF_FIXTURES, GUARD_FIXTURES } from './fixtures';

describe('Utils', () => {
  describe('calculateCheckDigit', () => {
    test.each([
      [
        'should calculate correct check digit for CPF',
        [1, 1, 1, 4, 4, 4, 7, 7, 7],
        CPF_FIRST_MULTIPLIERS,
        3,
      ],
      [
        'should return 0 when remainder is less than 2',
        [0, 0, 0, 0, 0, 0, 0, 0, 1],
        CPF_FIRST_MULTIPLIERS,
        9,
      ],
      ['should handle empty arrays', [], [], 0],
    ])('%s', (_title, digits, multipliers, expected) => {
      const result = calculateCheckDigit(digits, multipliers);

      expect(result).toBe(expected);
    });
  });

  describe('stringToDigitArray', () => {
    test.each([
      ['12345', [1, 2, 3, 4, 5]],
      ['7', [7]],
      ['00100', [0, 0, 1, 0, 0]],
    ])('should convert %s to digit array', (input, expected) => {
      const result = stringToDigitArray(input);

      expect(result).toEqual(expected);
    });
  });

  describe('removeNonDigits', () => {
    test.each([
      [GUARD_FIXTURES.cpfFormattedExample, GUARD_FIXTURES.cpfDigitsExample],
      [GUARD_FIXTURES.cnpjFormattedExample, GUARD_FIXTURES.cnpjDigitsExample],
      ['abc123def456', '123456'],
      ['abcdef', ''],
      [GUARD_FIXTURES.cpfDigitsExample, GUARD_FIXTURES.cpfDigitsExample],
    ])('should strip non-digits from %s', (input, expected) => {
      const result = removeNonDigits(input);

      expect(result).toBe(expected);
    });
  });

  describe('areAllDigitsSame', () => {
    test.each([
      [CPF_FIXTURES.invalidPatternAllOnes, true],
      [CPF_FIXTURES.invalidDigits.both, false],
      ['5', true],
      ['12', false],
    ])('areAllDigitsSame(%s) should be %s', (input, expected) => {
      const result = areAllDigitsSame(input);

      expect(result).toBe(expected);
    });
  });
});
