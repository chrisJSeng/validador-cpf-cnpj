import {
  CNPJ_LENGTH,
  CNPJ_FIRST_DIGIT_POSITION,
  CNPJ_SECOND_DIGIT_POSITION,
  CNPJ_FIRST_MULTIPLIERS,
  CNPJ_SECOND_MULTIPLIERS,
  CNPJ_ALLOWED_CHARS_REGEX,
  CNPJ_ALPHANUMERIC_REGEX,
  CNPJ_DIGIT_REGEX,
  INVALID_CNPJ_PATTERNS,
  ERROR_MESSAGES,
} from './constants';
import {
  guardIsString,
  guardNotEmpty,
  guardValidCharacters,
  guardLength,
  chainGuards,
} from './guards';
import { FormatOptions, GuardResult, IDocumentValidator, ValidationResult } from './types';
import {
  calculateCheckDigit,
  invalidResult,
  removeNonAlphanumeric,
  stringToBase36ValueArray,
  stripDocumentFormatting,
  validResult,
} from './utils';

export class CNPJValidator implements IDocumentValidator {
  private readonly firstDigitMultipliers: ReadonlyArray<number>;
  private readonly secondDigitMultipliers: ReadonlyArray<number>;

  constructor() {
    this.firstDigitMultipliers = CNPJ_FIRST_MULTIPLIERS;
    this.secondDigitMultipliers = CNPJ_SECOND_MULTIPLIERS;
  }

  public clean(input: string): string {
    return removeNonAlphanumeric(stripDocumentFormatting(input)).toUpperCase();
  }

  public format(input: string): string | null {
    const cleaned = this.clean(input);

    if (cleaned.length !== CNPJ_LENGTH) return null;

    const part1 = cleaned.slice(0, 2);
    const part2 = cleaned.slice(2, 5);
    const part3 = cleaned.slice(5, 8);
    const part4 = cleaned.slice(8, 12);
    const part5 = cleaned.slice(12, 14);

    return `${part1}.${part2}.${part3}/${part4}-${part5}`;
  }

  public validate(input: string): ValidationResult {
    const stringGuard = guardIsString(input);
    const notEmptyGuard = stringGuard.isValid
      ? guardNotEmpty(stringGuard.cleanedInput as string)
      : stringGuard;

    const baseGuard = chainGuards(stringGuard, notEmptyGuard);

    return baseGuard.isValid
      ? this.validateCleanedInput(baseGuard.cleanedInput as string)
      : invalidResult(baseGuard.error);
  }

  private validateCleanedInput(input: string): ValidationResult {
    const cleaned = this.clean(input);
    const charGuard = guardValidCharacters(cleaned, CNPJ_ALLOWED_CHARS_REGEX);
    const lengthGuard = guardLength(cleaned, CNPJ_LENGTH, ERROR_MESSAGES.INVALID_CNPJ_LENGTH);

    const structureGuard: GuardResult = CNPJ_ALPHANUMERIC_REGEX.test(cleaned)
      ? { isValid: true, cleanedInput: cleaned }
      : { isValid: false, error: ERROR_MESSAGES.INVALID_CHARACTERS };

    const patternGuard: GuardResult =
      CNPJ_DIGIT_REGEX.test(cleaned) && INVALID_CNPJ_PATTERNS.has(cleaned)
        ? { isValid: false, error: ERROR_MESSAGES.INVALID_CNPJ_PATTERN }
        : { isValid: true, cleanedInput: cleaned };

    const finalGuard = chainGuards(charGuard, lengthGuard, structureGuard, patternGuard);

    return finalGuard.isValid ? this.validateCheckDigits(cleaned) : invalidResult(finalGuard.error);
  }

  private validateCheckDigits(cnpj: string): ValidationResult {
    const values = stringToBase36ValueArray(cnpj);
    const firstProvided = Number(cnpj[CNPJ_FIRST_DIGIT_POSITION]);
    const secondProvided = Number(cnpj[CNPJ_SECOND_DIGIT_POSITION]);

    const firstDigit = calculateCheckDigit(
      values.slice(0, CNPJ_FIRST_DIGIT_POSITION),
      this.firstDigitMultipliers,
    );

    if (firstDigit !== firstProvided) return invalidResult(ERROR_MESSAGES.INVALID_CNPJ_DIGITS);

    const secondDigit = calculateCheckDigit(
      [...values.slice(0, CNPJ_FIRST_DIGIT_POSITION), firstDigit],
      this.secondDigitMultipliers,
    );

    if (secondDigit !== secondProvided) return invalidResult(ERROR_MESSAGES.INVALID_CNPJ_DIGITS);

    return validResult();
  }
}

const cnpjValidatorInstance = new CNPJValidator();

export function validateCNPJ(input: string): ValidationResult {
  return cnpjValidatorInstance.validate(input);
}

export function formatCNPJ(input: string, options?: FormatOptions): string | null {
  const shouldValidate = options?.validate === true;
  const isInvalidWhenStrict = shouldValidate && !cnpjValidatorInstance.validate(input).isValid;

  if (isInvalidWhenStrict) return null;

  return cnpjValidatorInstance.format(input);
}

export function cleanCNPJ(input: string): string {
  return cnpjValidatorInstance.clean(input);
}
