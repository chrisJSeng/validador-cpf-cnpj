import { CPFValidator, validateCPF, weakValidateCPF, formatCPF, cleanCPF, maskCPF } from '../cpf-validator';
import { ERROR_MESSAGES } from '../constants';
import { CPF_FIXTURES } from './fixtures';

describe('CPFValidator', () => {
  let validator: CPFValidator;

  beforeEach(() => {
    validator = new CPFValidator();
  });

  describe('clean', () => {
    test.each([
      ['should remove formatting from valid CPF', '123.456.789-01', '12345678901'],
      ['should handle already clean CPF', '12345678901', '12345678901'],
      ['should remove non-digit characters', 'a1b.2c3.d4e-01', '123401'],
    ])('%s', (_title, input, expected) => {
      expect(validator.clean(input)).toBe(expected);
    });
  });

  describe('format', () => {
    test.each([
      ['should format valid CPF', '12345678901', '123.456.789-01'],
      ['should format already formatted CPF', '123.456.789-01', '123.456.789-01'],
      ['should return null for invalid length', '123456', null],
      ['should return null for empty string', '', null],
    ])('%s', (_title, input, expected) => {
      expect(validator.format(input)).toBe(expected);
    });
  });

  describe('validate', () => {
    describe('valid CPFs', () => {
      test.each([
        ['should validate correct CPF without formatting', CPF_FIXTURES.valid],
        ['should validate correct CPF with formatting', CPF_FIXTURES.formatted],
        ['should validate another correct CPF', CPF_FIXTURES.otherValids[0]],
        ['should validate CPF with zeros', CPF_FIXTURES.otherValids[1]],
      ])('%s', (_title, input) => {
        const result = validator.validate(input);

        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });

    describe('invalid CPFs', () => {
      it('should reject non-string input', () => {
        const result = validator.validate({} as unknown as string);

        expect(result.isValid).toBe(false);
        expect(result.error).toBe(ERROR_MESSAGES.INVALID_TYPE);
      });

      test.each([
        ['should reject empty string', '', ERROR_MESSAGES.EMPTY_INPUT],
        ['should reject whitespace-only string', '   ', ERROR_MESSAGES.EMPTY_INPUT],
        [
          'should reject CPF with non-digit characters (after cleaning, length is wrong)',
          CPF_FIXTURES.invalidChars,
          ERROR_MESSAGES.INVALID_CPF_LENGTH,
        ],
        [
          'should reject CPF with wrong length',
          CPF_FIXTURES.wrongLength,
          ERROR_MESSAGES.INVALID_CPF_LENGTH,
        ],
        [
          'should reject CPF with all same digits',
          CPF_FIXTURES.invalidPatternAllOnes,
          ERROR_MESSAGES.INVALID_CPF_PATTERN,
        ],
        [
          'should reject CPF with all zeros',
          CPF_FIXTURES.invalidPatternAllZeros,
          ERROR_MESSAGES.INVALID_CPF_PATTERN,
        ],
      ])('%s', (_title, input, expectedError) => {
        const result = validator.validate(input);

        expect(result.isValid).toBe(false);
        expect(result.error).toBe(expectedError);
      });

      it('should reject CPF with invalid first check digit', () => {
        const result = validator.validate(CPF_FIXTURES.invalidDigits.first);

        expect(result.isValid).toBe(false);
        expect(result.error).toBe(ERROR_MESSAGES.INVALID_CPF_DIGITS);
      });

      it('should reject CPF with invalid second check digit', () => {
        const result = validator.validate(CPF_FIXTURES.invalidDigits.second);

        expect(result.isValid).toBe(false);
        expect(result.error).toBe(ERROR_MESSAGES.INVALID_CPF_DIGITS);
      });

      it('should reject CPF with both invalid check digits', () => {
        const result = validator.validate(CPF_FIXTURES.invalidDigits.both);

        expect(result.isValid).toBe(false);
        expect(result.error).toBe(ERROR_MESSAGES.INVALID_CPF_DIGITS);
      });
    });
  });

  describe('convenience functions', () => {
    it('validateCPF should work', () => {
      const result = validateCPF(CPF_FIXTURES.valid);

      expect(result.isValid).toBe(true);
    });

    it('formatCPF should work', () => {
      const result = formatCPF(CPF_FIXTURES.valid);

      expect(result).toBe(CPF_FIXTURES.formatted);
    });

    it('formatCPF should return null when validate option is enabled and CPF is invalid', () => {
      const result = formatCPF(CPF_FIXTURES.invalidDigits.both, { validate: true });

      expect(result).toBeNull();
    });

    it('maskCPF should work', () => {
      const result = maskCPF(CPF_FIXTURES.valid);

      expect(result).toBe(CPF_FIXTURES.masked);
    });

    it('maskCPF should return null when validate option is enabled and CPF is invalid', () => {
      const result = maskCPF(CPF_FIXTURES.invalidDigits.both, { validate: true });

      expect(result).toBeNull();
    });

    it('cleanCPF should work', () => {
      const result = cleanCPF(CPF_FIXTURES.formatted);

      expect(result).toBe(CPF_FIXTURES.valid);
    });
  });

  describe('weakValidate (structure only, skips check digits)', () => {
    it('should accept valid CPF', () => {
      const result = weakValidateCPF(CPF_FIXTURES.valid);

      expect(result.isValid).toBe(true);
    });

    it('should accept formatted valid CPF', () => {
      const result = weakValidateCPF(CPF_FIXTURES.formatted);

      expect(result.isValid).toBe(true);
    });

    it('should accept CPF with wrong check digits (weak validation)', () => {
      const result = weakValidateCPF(CPF_FIXTURES.invalidDigits.both);

      expect(result.isValid).toBe(true);
    });

    it('should accept CPF with wrong first check digit only', () => {
      const result = weakValidateCPF(CPF_FIXTURES.invalidDigits.first);

      expect(result.isValid).toBe(true);
    });

    it('should reject non-string input', () => {
      const result = weakValidateCPF(123 as unknown as string);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.INVALID_TYPE);
    });

    it('should reject CPF with wrong length', () => {
      const result = weakValidateCPF(CPF_FIXTURES.wrongLength);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.INVALID_CPF_LENGTH);
    });

    it('should reject CPF with all same digits', () => {
      const result = weakValidateCPF(CPF_FIXTURES.invalidPatternAllOnes);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.INVALID_CPF_PATTERN);
    });
  });

  describe('validateCPF with { weak: true } option', () => {
    it('should behave like weakValidateCPF when weak option is true', () => {
      const resultWeak = validateCPF(CPF_FIXTURES.invalidDigits.both, { weak: true });
      const resultWeakFunc = weakValidateCPF(CPF_FIXTURES.invalidDigits.both);

      expect(resultWeak.isValid).toBe(true);
      expect(resultWeak).toEqual(resultWeakFunc);
    });

    it('should use strict validation when weak option is false', () => {
      const result = validateCPF(CPF_FIXTURES.invalidDigits.both, { weak: false });

      expect(result.isValid).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.INVALID_CPF_DIGITS);
    });

    it('should use strict validation when no options provided', () => {
      const result = validateCPF(CPF_FIXTURES.invalidDigits.both);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.INVALID_CPF_DIGITS);
    });
  });
});
