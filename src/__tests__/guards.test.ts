import { guardIsString, guardNotEmpty, guardValidCharacters, guardLength, chainGuards } from '../guards';
import { ERROR_MESSAGES } from '../constants';

describe('Guards', () => {
  describe('guardIsString', () => {
    it('should return valid for string input', () => {
      const result = guardIsString('test');
      expect(result.isValid).toBe(true);
      expect(result.cleanedInput).toBe('test');
    });

    it('should return invalid for non-string input', () => {
      const result = guardIsString(123);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.INVALID_TYPE);
    });

    it('should return invalid for null input', () => {
      const result = guardIsString(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.INVALID_TYPE);
    });

    it('should return invalid for undefined input', () => {
      const result = guardIsString(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.INVALID_TYPE);
    });

    it('should return invalid for object input', () => {
      const result = guardIsString({});
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.INVALID_TYPE);
    });

    it('should return invalid for array input', () => {
      const result = guardIsString([]);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.INVALID_TYPE);
    });
  });

  describe('guardNotEmpty', () => {
    it('should return valid for non-empty string', () => {
      const result = guardNotEmpty('test');
      expect(result.isValid).toBe(true);
      expect(result.cleanedInput).toBe('test');
    });

    it('should return invalid for empty string', () => {
      const result = guardNotEmpty('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.EMPTY_INPUT);
    });

    it('should return invalid for whitespace-only string', () => {
      const result = guardNotEmpty('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.EMPTY_INPUT);
    });

    it('should trim whitespace from valid input', () => {
      const result = guardNotEmpty('  test  ');
      expect(result.isValid).toBe(true);
      expect(result.cleanedInput).toBe('test');
    });
  });

  describe('guardValidCharacters', () => {
    it('should return valid for input matching pattern', () => {
      const result = guardValidCharacters('12345', /^\d+$/);
      expect(result.isValid).toBe(true);
      expect(result.cleanedInput).toBe('12345');
    });

    it('should return invalid for input not matching pattern', () => {
      const result = guardValidCharacters('abc', /^\d+$/);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.INVALID_CHARACTERS);
    });

    it('should remove common formatting characters', () => {
      const result = guardValidCharacters('123.456.789-01', /^\d+$/);
      expect(result.isValid).toBe(true);
      expect(result.cleanedInput).toBe('12345678901');
    });

    it('should handle input with slashes', () => {
      const result = guardValidCharacters('12.345.678/0001-90', /^\d+$/);
      expect(result.isValid).toBe(true);
      expect(result.cleanedInput).toBe('12345678000190');
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
      const guard2 = { isValid: false, error: 'Error at step 2' };
      const guard3 = { isValid: true, cleanedInput: 'step3' };

      const result = chainGuards(guard1, guard2, guard3);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Error at step 2');
    });

    it('should throw error for empty guards array', () => {
      expect(() => chainGuards()).toThrow('chainGuards requires at least one guard');
    });

    it('should handle single guard', () => {
      const guard = { isValid: true, cleanedInput: 'single' };
      const result = chainGuards(guard);
      expect(result.isValid).toBe(true);
      expect(result.cleanedInput).toBe('single');
    });
  });
});
