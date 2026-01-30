import { CNPJValidator, validateCNPJ, formatCNPJ, cleanCNPJ } from '../cnpj-validator';
import { ERROR_MESSAGES } from '../constants';

describe('CNPJValidator', () => {
  let validator: CNPJValidator;

  beforeEach(() => {
    validator = new CNPJValidator();
  });

  describe('clean', () => {
    it('should remove formatting from valid CNPJ', () => {
      expect(validator.clean('11.222.333/0001-81')).toBe('11222333000181');
    });

    it('should handle already clean CNPJ', () => {
      expect(validator.clean('11222333000181')).toBe('11222333000181');
    });

    it('should remove all non-digit characters', () => {
      expect(validator.clean('11abc.222def.333/0001-81')).toBe('11222333000181');
    });
  });

  describe('format', () => {
    it('should format valid CNPJ', () => {
      expect(validator.format('11222333000181')).toBe('11.222.333/0001-81');
    });

    it('should format already formatted CNPJ', () => {
      expect(validator.format('11.222.333/0001-81')).toBe('11.222.333/0001-81');
    });

    it('should return null for invalid length', () => {
      expect(validator.format('123456')).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(validator.format('')).toBeNull();
    });
  });

  describe('validate', () => {
    describe('valid CNPJs', () => {
      it('should validate correct CNPJ without formatting', () => {
        const result = validator.validate('11222333000181');
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });

      it('should validate correct CNPJ with formatting', () => {
        const result = validator.validate('11.222.333/0001-81');
        expect(result.isValid).toBe(true);
      });

      it('should validate another correct CNPJ', () => {
        const result = validator.validate('11444777000161');
        expect(result.isValid).toBe(true);
      });

      it('should validate CNPJ with zeros', () => {
        const result = validator.validate('00000000000191');
        expect(result.isValid).toBe(true);
      });
    });

    describe('invalid CNPJs', () => {
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

      it('should reject CNPJ with letters', () => {
        const result = validator.validate('ab.cde.fgh/ijkl-mn');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(ERROR_MESSAGES.INVALID_CHARACTERS);
      });

      it('should reject CNPJ with wrong length', () => {
        const result = validator.validate('123456789');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(ERROR_MESSAGES.INVALID_CNPJ_LENGTH);
      });

      it('should reject CNPJ with all same digits', () => {
        const result = validator.validate('11111111111111');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(ERROR_MESSAGES.INVALID_CNPJ_PATTERN);
      });

      it('should reject CNPJ with all zeros', () => {
        const result = validator.validate('00000000000000');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(ERROR_MESSAGES.INVALID_CNPJ_PATTERN);
      });

      it('should reject CNPJ with invalid first check digit', () => {
        const result = validator.validate('11222333000182');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(ERROR_MESSAGES.INVALID_CNPJ_DIGITS);
      });

      it('should reject CNPJ with invalid second check digit', () => {
        const result = validator.validate('11222333000180');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(ERROR_MESSAGES.INVALID_CNPJ_DIGITS);
      });

      it('should reject CNPJ with both invalid check digits', () => {
        const result = validator.validate('11222333000100');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(ERROR_MESSAGES.INVALID_CNPJ_DIGITS);
      });
    });
  });

  describe('convenience functions', () => {
    it('validateCNPJ should work', () => {
      const result = validateCNPJ('11222333000181');
      expect(result.isValid).toBe(true);
    });

    it('formatCNPJ should work', () => {
      const result = formatCNPJ('11222333000181');
      expect(result).toBe('11.222.333/0001-81');
    });

    it('cleanCNPJ should work', () => {
      const result = cleanCNPJ('11.222.333/0001-81');
      expect(result).toBe('11222333000181');
    });
  });
});
