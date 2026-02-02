import {
  guardIsString,
  guardNotEmpty,
  guardValidCharacters,
  guardLength,
  chainGuards,
} from '../guards';
import { DIGITS_ONLY_REGEX, ERROR_MESSAGES, INTERNAL_MESSAGES } from '../constants';
import { stripDocumentFormatting } from '../utils';
import { GUARD_FIXTURES } from './fixtures';

describe('Guards', () => {
  describe('guardIsString', () => {
    it('should return valid for string input', () => {
      const result = guardIsString(GUARD_FIXTURES.someText);

      expect(result.isValid).toBe(true);
      expect(result.cleanedInput).toBe(GUARD_FIXTURES.someText);
    });

    test.each([
      ['should return invalid for non-string input', 123],
      ['should return invalid for null input', null],
      ['should return invalid for undefined input', undefined],
      ['should return invalid for object input', {}],
      ['should return invalid for array input', []],
    ])('%s', (_title, input) => {
      const result = guardIsString(input);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.INVALID_TYPE);
    });
  });

  describe('guardNotEmpty', () => {
    test.each([
      [
        'should return valid for non-empty string',
        GUARD_FIXTURES.someText,
        GUARD_FIXTURES.someText,
      ],
      ['should trim whitespace from valid input', '  test  ', 'test'],
    ])('%s', (_title, input, expectedCleaned) => {
      const result = guardNotEmpty(input);

      expect(result.isValid).toBe(true);
      expect(result.cleanedInput).toBe(expectedCleaned);
    });

    test.each([
      ['should return invalid for empty string', '', ERROR_MESSAGES.EMPTY_INPUT],
      ['should return invalid for whitespace-only string', '   ', ERROR_MESSAGES.EMPTY_INPUT],
    ])('%s', (_title, input, expectedError) => {
      const result = guardNotEmpty(input);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe(expectedError);
    });
  });

  describe('guardValidCharacters', () => {
    it('should return valid for input matching pattern', () => {
      const result = guardValidCharacters('12345', DIGITS_ONLY_REGEX);

      expect(result.isValid).toBe(true);
      expect(result.cleanedInput).toBe('12345');
    });

    it('should return invalid for input not matching pattern', () => {
      const result = guardValidCharacters('abc', DIGITS_ONLY_REGEX);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.INVALID_CHARACTERS);
    });

    test.each([
      [GUARD_FIXTURES.cpfFormattedExample, GUARD_FIXTURES.cpfDigitsExample],
      [GUARD_FIXTURES.cnpjFormattedExample, GUARD_FIXTURES.cnpjDigitsExample],
    ])('should validate digits after stripping formatting: %s', (input, expectedCleaned) => {
      const result = guardValidCharacters(stripDocumentFormatting(input), DIGITS_ONLY_REGEX);

      expect(result.isValid).toBe(true);
      expect(result.cleanedInput).toBe(expectedCleaned);
    });
  });

  describe('guardLength', () => {
    it('should return valid for correct length', () => {
      const result = guardLength('12345', 5, 'Invalid length');

      expect(result.isValid).toBe(true);
      expect(result.cleanedInput).toBe('12345');
    });

    it('should return invalid for incorrect length', () => {
      const result = guardLength('1234', 5, 'Invalid length');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid length');
    });

    it('should use custom error message', () => {
      const customError = 'Custom error message';
      const result = guardLength('12345', 10, customError);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe(customError);
    });
  });

  describe('chainGuards', () => {
    it('should return last guard result when all are valid', () => {
      const guard1 = { isValid: true, cleanedInput: 'step1' };
      const guard2 = { isValid: true, cleanedInput: 'step2' };
      const guard3 = { isValid: true, cleanedInput: 'step3' };
      const result = chainGuards(guard1, guard2, guard3);

      expect(result.isValid).toBe(true);
      expect(result.cleanedInput).toBe('step3');
    });

    it('should return first invalid guard result', () => {
      const guard1 = { isValid: true, cleanedInput: 'step1' };
      const guard2 = { isValid: false, error: 'guard2 error' };
      const guard3 = { isValid: true, cleanedInput: 'step3' };
      const result = chainGuards(guard1, guard2, guard3);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('guard2 error');
    });

    it('should throw error when no guards provided', () => {
      expect(() => chainGuards()).toThrow(INTERNAL_MESSAGES.CHAIN_GUARDS_REQUIRES_AT_LEAST_ONE);
    });

    it('should handle single guard', () => {
      const guard = { isValid: true, cleanedInput: 'single' };
      const result = chainGuards(guard);

      expect(result.isValid).toBe(true);
      expect(result.cleanedInput).toBe('single');
    });
  });
});
