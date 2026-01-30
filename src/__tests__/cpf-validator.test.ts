import { CPFValidator, validateCPF, formatCPF, cleanCPF } from '../cpf-validator';
import { ERROR_MESSAGES } from '../constants';

describe('CPFValidator', () => {
  let validator: CPFValidator;

  beforeEach(() => {
    validator = new CPFValidator();
  });

  describe('clean', () => {
    it('should remove formatting from valid CPF', () => {
      expect(validator.clean('123.456.789-01')).toBe('12345678901');
    });

    it('should handle already clean CPF', () => {
      expect(validator.clean('12345678901')).toBe('12345678901');
    });

    it('should remove all non-digit characters', () => {
      expect(validator.clean('123abc.456def.789-01')).toBe('12345678901');
    });
  });

  describe('format', () => {
    it('should format valid CPF', () => {
      expect(validator.format('12345678901')).toBe('123.456.789-01');
    });

    it('should format already formatted CPF', () => {
      expect(validator.format('123.456.789-01')).toBe('123.456.789-01');
    });

    it('should return null for invalid length', () => {
      expect(validator.format('123456')).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(validator.format('')).toBeNull();
    });
  });

  describe('validate', () => {
    describe('valid CPFs', () => {
      it('should validate correct CPF without formatting', () => {
        const result = validator.validate('11144477735');
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });

      it('should validate correct CPF with formatting', () => {
        const result = validator.validate('111.444.777-35');
        expect(result.isValid).toBe(true);
      });

      it('should validate another correct CPF', () => {
        const result = validator.validate('52998224725');
        expect(result.isValid).toBe(true);
      });

      it('should validate CPF with zeros', () => {
        const result = validator.validate('00000000191');
        expect(result.isValid).toBe(true);
      });
    });

    describe('invalid CPFs', () => {
      it('should reject non-string input', () => {
        const result = validator.validate(123 as unknown as string);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(ERROR_MESSAGES.INVALID_TYPE);
      });

      it('should reject empty string', () => {
        const result = validator.validate('');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(ERROR_MESSAGES.EMPTY_INPUT);
      });

      it('should reject whitespace-only string', () => {
        const result = validator.validate('   ');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(ERROR_MESSAGES.EMPTY_INPUT);
      });

      it('should reject CPF with letters', () => {
        const result = validator.validate('abc.def.ghi-jk');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(ERROR_MESSAGES.INVALID_CHARACTERS);
      });

      it('should reject CPF with wrong length', () => {
        const result = validator.validate('123456789');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(ERROR_MESSAGES.INVALID_CPF_LENGTH);
      });

      it('should reject CPF with all same digits', () => {
        const result = validator.validate('11111111111');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(ERROR_MESSAGES.INVALID_CPF_PATTERN);
      });

      it('should reject CPF with all zeros', () => {
        const result = validator.validate('00000000000');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(ERROR_MESSAGES.INVALID_CPF_PATTERN);
      });

      it('should reject CPF with invalid first check digit', () => {
        const result = validator.validate('11144477736');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(ERROR_MESSAGES.INVALID_CPF_DIGITS);
      });

      it('should reject CPF with invalid second check digit', () => {
        const result = validator.validate('11144477734');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(ERROR_MESSAGES.INVALID_CPF_DIGITS);
      });

      it('should reject CPF with both invalid check digits', () => {
        const result = validator.validate('12345678901');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(ERROR_MESSAGES.INVALID_CPF_DIGITS);
      });
    });
  });

  describe('convenience functions', () => {
    it('validateCPF should work', () => {
      const result = validateCPF('11144477735');
      expect(result.isValid).toBe(true);
    });

    it('formatCPF should work', () => {
      const result = formatCPF('11144477735');
      expect(result).toBe('111.444.777-35');
    });

    it('cleanCPF should work', () => {
      const result = cleanCPF('111.444.777-35');
      expect(result).toBe('11144477735');
    });
  });
});
