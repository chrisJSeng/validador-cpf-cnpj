import {
  CPF_LENGTH,
  CPF_FIRST_DIGIT_POSITION,
  CPF_SECOND_DIGIT_POSITION,
  CPF_FIRST_DIGIT_MULTIPLIER_START,
  CPF_SECOND_DIGIT_MULTIPLIER_START,
  CPF_DIGIT_REGEX,
  INVALID_CPF_PATTERNS,
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
 * CPF Validator class following SOLID principles
 * Single Responsibility: Only validates CPF
 * Open/Closed: Open for extension via interface
 * Liskov Substitution: Implements IDocumentValidator interface
 * Interface Segregation: Uses minimal interface
 * Dependency Inversion: Depends on abstractions (interface)
 */
export class CPFValidator implements IDocumentValidator {
  /**
   * Pre-calculated multipliers for performance
   */
  private readonly firstDigitMultipliers: ReadonlyArray<number>;
  private readonly secondDigitMultipliers: ReadonlyArray<number>;

  constructor() {
    // Pre-calculate multipliers for performance
    this.firstDigitMultipliers = Object.freeze(
      Array.from({ length: CPF_FIRST_DIGIT_POSITION }, (_, i) => CPF_FIRST_DIGIT_MULTIPLIER_START - i),
    );
    this.secondDigitMultipliers = Object.freeze(
      Array.from({ length: CPF_SECOND_DIGIT_POSITION }, (_, i) => CPF_SECOND_DIGIT_MULTIPLIER_START - i),
    );
  }

  /**
   * Cleans CPF input by removing formatting characters
   */
  public clean(input: string): string {
    return removeNonDigits(input);
  }

  /**
   * Formats CPF to standard format: XXX.XXX.XXX-XX
   */
  public format(input: string): string | null {
    const cleaned = this.clean(input);

    if (cleaned.length !== CPF_LENGTH) {
      return null;
    }

    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
  }

  /**
   * Validates CPF with comprehensive checks
   */
  public validate(input: string): ValidationResult {
    // Guard rail: Input validation
    const stringGuard = guardIsString(input);
    if (!stringGuard.isValid) {
      return { isValid: false, error: stringGuard.error };
    }

    const notEmptyGuard = guardNotEmpty(stringGuard.cleanedInput as string);
    if (!notEmptyGuard.isValid) {
      return { isValid: false, error: notEmptyGuard.error };
    }

    // Clean and validate characters
    const cleaned = this.clean(notEmptyGuard.cleanedInput as string);
    const charGuard = guardValidCharacters(cleaned, CPF_DIGIT_REGEX);
    if (!charGuard.isValid) {
      return { isValid: false, error: charGuard.error };
    }

    // Validate length
    const lengthGuard = guardLength(cleaned, CPF_LENGTH, ERROR_MESSAGES.INVALID_CPF_LENGTH);
    if (!lengthGuard.isValid) {
      return { isValid: false, error: lengthGuard.error };
    }

    // Check for known invalid patterns using Set for O(1) lookup
    if (INVALID_CPF_PATTERNS.has(cleaned)) {
      return { isValid: false, error: ERROR_MESSAGES.INVALID_CPF_PATTERN };
    }

    // Validate check digits
    return this.validateCheckDigits(cleaned);
  }

  /**
   * Validates CPF check digits
   * @private
   */
  private validateCheckDigits(cpf: string): ValidationResult {
    const digits = stringToDigitArray(cpf);

    // Calculate first check digit
    const firstDigit = calculateCheckDigit(
      digits.slice(0, CPF_FIRST_DIGIT_POSITION),
      this.firstDigitMultipliers,
    );

    if (firstDigit !== digits[CPF_FIRST_DIGIT_POSITION]) {
      return { isValid: false, error: ERROR_MESSAGES.INVALID_CPF_DIGITS };
    }

    // Calculate second check digit
    const secondDigit = calculateCheckDigit(
      digits.slice(0, CPF_SECOND_DIGIT_POSITION),
      this.secondDigitMultipliers,
    );

    if (secondDigit !== digits[CPF_SECOND_DIGIT_POSITION]) {
      return { isValid: false, error: ERROR_MESSAGES.INVALID_CPF_DIGITS };
    }

    return { isValid: true };
  }
}

/**
 * Singleton CPF validator instance for convenience functions
 */
const cpfValidatorInstance = new CPFValidator();

/**
 * Convenience function to validate CPF
 * Note: For repeated validations, consider using the CPFValidator class directly for better performance
 */
export function validateCPF(input: string): ValidationResult {
  return cpfValidatorInstance.validate(input);
}

/**
 * Convenience function to format CPF
 * Note: For repeated operations, consider using the CPFValidator class directly for better performance
 */
export function formatCPF(input: string): string | null {
  return cpfValidatorInstance.format(input);
}

/**
 * Convenience function to clean CPF
 * Note: For repeated operations, consider using the CPFValidator class directly for better performance
 */
export function cleanCPF(input: string): string {
  return cpfValidatorInstance.clean(input);
}
