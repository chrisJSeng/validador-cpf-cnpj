import {
  CNPJ_LENGTH,
  CNPJ_FIRST_DIGIT_POSITION,
  CNPJ_SECOND_DIGIT_POSITION,
  CNPJ_FIRST_MULTIPLIERS,
  CNPJ_SECOND_MULTIPLIERS,
  CNPJ_DIGIT_REGEX,
  INVALID_CNPJ_PATTERNS,
  ERROR_MESSAGES,
} from './constants';
import {
  guardIsString,
  guardNotEmpty,
  guardValidCharacters,
  guardLength,
} from './guards';
import { IDocumentValidator, ValidationResult } from './types';
import { calculateCheckDigit, stringToDigitArray, removeNonDigits } from './utils';

/**
 * CNPJ Validator class following SOLID principles
 * Single Responsibility: Only validates CNPJ
 * Open/Closed: Open for extension via interface
 * Liskov Substitution: Implements IDocumentValidator interface
 * Interface Segregation: Uses minimal interface
 * Dependency Inversion: Depends on abstractions (interface)
 */
export class CNPJValidator implements IDocumentValidator {
  /**
   * Multipliers for CNPJ validation (immutable)
   */
  private readonly firstDigitMultipliers: ReadonlyArray<number>;
  private readonly secondDigitMultipliers: ReadonlyArray<number>;

  constructor() {
    // Use frozen constants for performance and safety
    this.firstDigitMultipliers = CNPJ_FIRST_MULTIPLIERS;
    this.secondDigitMultipliers = CNPJ_SECOND_MULTIPLIERS;
  }

  /**
   * Cleans CNPJ input by removing formatting characters
   */
  public clean(input: string): string {
    return removeNonDigits(input);
  }

  /**
   * Formats CNPJ to standard format: XX.XXX.XXX/XXXX-XX
   */
  public format(input: string): string | null {
    const cleaned = this.clean(input);

    if (cleaned.length !== CNPJ_LENGTH) {
      return null;
    }

    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12, 14)}`;
  }

  /**
   * Validates CNPJ with comprehensive checks
   */
  public validate(input: string): ValidationResult {
    // Guard rail: Input validation
    const stringGuard = guardIsString(input);
    if (!stringGuard.isValid) {
      return { isValid: false, error: stringGuard.error };
    }

    const notEmptyGuard = guardNotEmpty(stringGuard.cleanedInput!);
    if (!notEmptyGuard.isValid) {
      return { isValid: false, error: notEmptyGuard.error };
    }

    // Clean and validate characters
    const cleaned = this.clean(notEmptyGuard.cleanedInput!);
    const charGuard = guardValidCharacters(cleaned, CNPJ_DIGIT_REGEX);
    if (!charGuard.isValid) {
      return { isValid: false, error: charGuard.error };
    }

    // Validate length
    const lengthGuard = guardLength(cleaned, CNPJ_LENGTH, ERROR_MESSAGES.INVALID_CNPJ_LENGTH);
    if (!lengthGuard.isValid) {
      return { isValid: false, error: lengthGuard.error };
    }

    // Check for known invalid patterns using Set for O(1) lookup
    if (INVALID_CNPJ_PATTERNS.has(cleaned)) {
      return { isValid: false, error: ERROR_MESSAGES.INVALID_CNPJ_PATTERN };
    }

    // Validate check digits
    return this.validateCheckDigits(cleaned);
  }

  /**
   * Validates CNPJ check digits
   * @private
   */
  private validateCheckDigits(cnpj: string): ValidationResult {
    const digits = stringToDigitArray(cnpj);

    // Calculate first check digit
    const firstDigit = calculateCheckDigit(
      digits.slice(0, CNPJ_FIRST_DIGIT_POSITION),
      this.firstDigitMultipliers,
    );

    if (firstDigit !== digits[CNPJ_FIRST_DIGIT_POSITION]) {
      return { isValid: false, error: ERROR_MESSAGES.INVALID_CNPJ_DIGITS };
    }

    // Calculate second check digit
    const secondDigit = calculateCheckDigit(
      digits.slice(0, CNPJ_SECOND_DIGIT_POSITION),
      this.secondDigitMultipliers,
    );

    if (secondDigit !== digits[CNPJ_SECOND_DIGIT_POSITION]) {
      return { isValid: false, error: ERROR_MESSAGES.INVALID_CNPJ_DIGITS };
    }

    return { isValid: true };
  }
}

/**
 * Convenience function to validate CNPJ
 */
export function validateCNPJ(input: string): ValidationResult {
  const validator = new CNPJValidator();
  return validator.validate(input);
}

/**
 * Convenience function to format CNPJ
 */
export function formatCNPJ(input: string): string | null {
  const validator = new CNPJValidator();
  return validator.format(input);
}

/**
 * Convenience function to clean CNPJ
 */
export function cleanCNPJ(input: string): string {
  const validator = new CNPJValidator();
  return validator.clean(input);
}
