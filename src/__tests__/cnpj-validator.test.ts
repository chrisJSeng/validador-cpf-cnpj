import { CNPJValidator, validateCNPJ, weakValidateCNPJ, formatCNPJ, cleanCNPJ } from '../cnpj-validator';
import { CNPJ_FIRST_MULTIPLIERS, CNPJ_SECOND_MULTIPLIERS, ERROR_MESSAGES } from '../constants';
import { calculateCheckDigit, stringToBase36ValueArray } from '../utils';
import { CNPJ_FIXTURES } from './fixtures';

describe('CNPJValidator', () => {
  let validator: CNPJValidator;

  beforeEach(() => {
    validator = new CNPJValidator();
  });

  describe('clean', () => {
    test.each([
      ['should remove formatting from valid CNPJ', CNPJ_FIXTURES.formatted, CNPJ_FIXTURES.valid],
      ['should handle already clean CNPJ', CNPJ_FIXTURES.valid, CNPJ_FIXTURES.valid],
      [
        'should keep alphanumeric characters and uppercase',
        CNPJ_FIXTURES.alphanumeric.mixedFormatted,
        CNPJ_FIXTURES.alphanumeric.mixedCleaned,
      ],
    ])('%s', (_title, input, expected) => {
      expect(validator.clean(input)).toBe(expected);
    });
  });

  describe('format', () => {
    test.each([
      ['should format valid CNPJ', CNPJ_FIXTURES.valid, CNPJ_FIXTURES.formatted],
      ['should format already formatted CNPJ', CNPJ_FIXTURES.formatted, CNPJ_FIXTURES.formatted],
      ['should return null for invalid length', '123456', null],
      ['should return null for empty string', '', null],
    ])('%s', (_title, input, expected) => {
      expect(validator.format(input)).toBe(expected);
    });
  });

  describe('validate', () => {
    describe('valid CNPJs', () => {
      test.each([
        ['should validate correct CNPJ without formatting', CNPJ_FIXTURES.valid],
        ['should validate correct CNPJ with formatting', CNPJ_FIXTURES.formatted],
        ['should validate another correct CNPJ', CNPJ_FIXTURES.otherValids[0]],
        ['should validate CNPJ with zeros', CNPJ_FIXTURES.otherValids[1]],
      ])('%s', (_title, input) => {
        const result = validator.validate(input);

        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });

      it('should validate an alphanumeric CNPJ (base36 + mod11)', () => {
        const base = CNPJ_FIXTURES.alphanumeric.base12;
        const v1 = calculateCheckDigit(stringToBase36ValueArray(base), CNPJ_FIRST_MULTIPLIERS);
        const v2 = calculateCheckDigit(
          [...stringToBase36ValueArray(base), v1],
          CNPJ_SECOND_MULTIPLIERS,
        );
        const cnpj = `${base}${v1}${v2}`;
        const result = validator.validate(cnpj);

        expect(result.isValid).toBe(true);
      });
    });

    describe('invalid CNPJs', () => {
      it('should reject non-string input', () => {
        const result = validator.validate({} as unknown as string);

        expect(result.isValid).toBe(false);
        expect(result.error).toBe(ERROR_MESSAGES.INVALID_TYPE);
      });

      test.each([
        ['should reject empty string', '', ERROR_MESSAGES.EMPTY_INPUT],
        ['should reject whitespace-only string', '   ', ERROR_MESSAGES.EMPTY_INPUT],
        [
          'should reject CNPJ when last two characters are not digits',
          CNPJ_FIXTURES.alphanumeric.lastTwoNotDigits,
          ERROR_MESSAGES.INVALID_CHARACTERS,
        ],
        [
          'should reject CNPJ with wrong length',
          CNPJ_FIXTURES.wrongLength,
          ERROR_MESSAGES.INVALID_CNPJ_LENGTH,
        ],
        [
          'should reject CNPJ with all same digits',
          CNPJ_FIXTURES.invalidPatternAllOnes,
          ERROR_MESSAGES.INVALID_CNPJ_PATTERN,
        ],
        [
          'should reject CNPJ with all zeros',
          CNPJ_FIXTURES.invalidPatternAllZeros,
          ERROR_MESSAGES.INVALID_CNPJ_PATTERN,
        ],
      ])('%s', (_title, input, expectedError) => {
        const result = validator.validate(input);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(expectedError);
      });

      it('should reject CNPJ with invalid first check digit', () => {
        const result = validator.validate(CNPJ_FIXTURES.invalidDigits.first);

        expect(result.isValid).toBe(false);
        expect(result.error).toBe(ERROR_MESSAGES.INVALID_CNPJ_DIGITS);
      });

      it('should reject CNPJ with invalid second check digit', () => {
        const result = validator.validate(CNPJ_FIXTURES.invalidDigits.second);

        expect(result.isValid).toBe(false);
        expect(result.error).toBe(ERROR_MESSAGES.INVALID_CNPJ_DIGITS);
      });

      it('should reject CNPJ with both invalid check digits', () => {
        const result = validator.validate(CNPJ_FIXTURES.invalidDigits.both);

        expect(result.isValid).toBe(false);
        expect(result.error).toBe(ERROR_MESSAGES.INVALID_CNPJ_DIGITS);
      });
    });
  });

  describe('convenience functions', () => {
    it('validateCNPJ should work', () => {
      const result = validateCNPJ(CNPJ_FIXTURES.valid);

      expect(result.isValid).toBe(true);
    });

    it('formatCNPJ should work', () => {
      const result = formatCNPJ(CNPJ_FIXTURES.valid);

      expect(result).toBe(CNPJ_FIXTURES.formatted);
    });

    it('formatCNPJ should return null when validate option is enabled and CNPJ is invalid', () => {
      const result = formatCNPJ(CNPJ_FIXTURES.invalidDigits.both, { validate: true });

      expect(result).toBeNull();
    });

    it('cleanCNPJ should work', () => {
      const result = cleanCNPJ(CNPJ_FIXTURES.formatted);

      expect(result).toBe(CNPJ_FIXTURES.valid);
    });
  });

  describe('weakValidate (structure only, skips check digits)', () => {
    it('should accept valid CNPJ', () => {
      const result = weakValidateCNPJ(CNPJ_FIXTURES.valid);

      expect(result.isValid).toBe(true);
    });

    it('should accept formatted valid CNPJ', () => {
      const result = weakValidateCNPJ(CNPJ_FIXTURES.formatted);

      expect(result.isValid).toBe(true);
    });

    it('should accept CNPJ with wrong check digits (weak validation)', () => {
      const result = weakValidateCNPJ(CNPJ_FIXTURES.invalidDigits.both);

      expect(result.isValid).toBe(true);
    });

    it('should accept alphanumeric CNPJ with arbitrary check digits', () => {
      const result = weakValidateCNPJ('NZ.83Y.1JX/0001-69');

      expect(result.isValid).toBe(true);
    });

    it('should accept mixed case alphanumeric CNPJ', () => {
      const result = weakValidateCNPJ('1a.23b.45c/678d-90');

      expect(result.isValid).toBe(true);
    });

    it('should reject non-string input', () => {
      const result = weakValidateCNPJ(123 as unknown as string);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.INVALID_TYPE);
    });

    it('should reject CNPJ with wrong length', () => {
      const result = weakValidateCNPJ(CNPJ_FIXTURES.wrongLength);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.INVALID_CNPJ_LENGTH);
    });

    it('should reject CNPJ when last two characters are not digits', () => {
      const result = weakValidateCNPJ(CNPJ_FIXTURES.alphanumeric.lastTwoNotDigits);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.INVALID_CHARACTERS);
    });

    it('should reject CNPJ with all same digits', () => {
      const result = weakValidateCNPJ(CNPJ_FIXTURES.invalidPatternAllOnes);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.INVALID_CNPJ_PATTERN);
    });
  });

  describe('validateCNPJ with { weak: true } option', () => {
    it('should behave like weakValidateCNPJ when weak option is true', () => {
      const resultWeak = validateCNPJ(CNPJ_FIXTURES.invalidDigits.both, { weak: true });
      const resultWeakFunc = weakValidateCNPJ(CNPJ_FIXTURES.invalidDigits.both);

      expect(resultWeak.isValid).toBe(true);
      expect(resultWeak).toEqual(resultWeakFunc);
    });

    it('should accept alphanumeric CNPJ with arbitrary check digits when weak', () => {
      const result = validateCNPJ('NZ.83Y.1JX/0001-69', { weak: true });

      expect(result.isValid).toBe(true);
    });

    it('should use strict validation when weak option is false', () => {
      const result = validateCNPJ(CNPJ_FIXTURES.invalidDigits.both, { weak: false });

      expect(result.isValid).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.INVALID_CNPJ_DIGITS);
    });

    it('should use strict validation when no options provided', () => {
      const result = validateCNPJ(CNPJ_FIXTURES.invalidDigits.both);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.INVALID_CNPJ_DIGITS);
    });
  });
});
