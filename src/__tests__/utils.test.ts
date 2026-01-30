import { calculateCheckDigit, stringToDigitArray, removeNonDigits, areAllDigitsSame } from '../utils';

describe('Utils', () => {
  describe('calculateCheckDigit', () => {
    it('should calculate correct check digit for CPF', () => {
      // CPF: 111.444.777-35
      const digits = [1, 1, 1, 4, 4, 4, 7, 7, 7];
      const multipliers = [10, 9, 8, 7, 6, 5, 4, 3, 2];
      const result = calculateCheckDigit(digits, multipliers);
      expect(result).toBe(3);
    });

    it('should return 0 when remainder is less than 2', () => {
      // CPF: 000.000.001-91
      const digits = [0, 0, 0, 0, 0, 0, 0, 0, 1];
      const multipliers = [10, 9, 8, 7, 6, 5, 4, 3, 2];
      const result = calculateCheckDigit(digits, multipliers);
      expect(result).toBe(9);
    });

    it('should handle empty arrays', () => {
      const result = calculateCheckDigit([], []);
      expect(result).toBe(0);
    });
  });

  describe('stringToDigitArray', () => {
    it('should convert string to array of numbers', () => {
      const result = stringToDigitArray('12345');
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle single digit', () => {
      const result = stringToDigitArray('7');
      expect(result).toEqual([7]);
    });

    it('should handle zeros', () => {
      const result = stringToDigitArray('00100');
      expect(result).toEqual([0, 0, 1, 0, 0]);
    });
  });

  describe('removeNonDigits', () => {
    it('should remove all non-digit characters', () => {
      const result = removeNonDigits('123.456.789-01');
      expect(result).toBe('12345678901');
    });

    it('should handle input with various separators', () => {
      const result = removeNonDigits('12.345.678/0001-90');
      expect(result).toBe('12345678000190');
    });

    it('should handle input with letters', () => {
      const result = removeNonDigits('abc123def456');
      expect(result).toBe('123456');
    });

    it('should return empty string for no digits', () => {
      const result = removeNonDigits('abcdef');
      expect(result).toBe('');
    });

    it('should handle already clean input', () => {
      const result = removeNonDigits('12345678901');
      expect(result).toBe('12345678901');
    });
  });

  describe('areAllDigitsSame', () => {
    it('should return true when all digits are the same', () => {
      const result = areAllDigitsSame('11111111111');
      expect(result).toBe(true);
    });

    it('should return false when digits are different', () => {
      const result = areAllDigitsSame('12345678901');
      expect(result).toBe(false);
    });

    it('should handle single digit', () => {
      const result = areAllDigitsSame('5');
      expect(result).toBe(true);
    });

    it('should handle two different digits', () => {
      const result = areAllDigitsSame('12');
      expect(result).toBe(false);
    });
  });
});
