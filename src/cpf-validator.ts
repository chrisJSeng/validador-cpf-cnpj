import {
  CPF_LENGTH,
  CPF_FIRST_DIGIT_POSITION,
  CPF_SECOND_DIGIT_POSITION,
  CPF_ALPHANUMERIC_REGEX,
  CPF_ALLOWED_CHARS_REGEX,
  CPF_DIGIT_REGEX,
  CPF_FIRST_MULTIPLIERS,
  CPF_SECOND_MULTIPLIERS,
  INVALID_CPF_PATTERNS,
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
  removeNonDigits,
  stringToDigitArray,
  stripDocumentFormatting,
  validResult,
} from './utils';

export class CPFValidator implements IDocumentValidator {
  private readonly firstDigitMultipliers: ReadonlyArray<number>;
  private readonly secondDigitMultipliers: ReadonlyArray<number>;

  constructor() {
    this.firstDigitMultipliers = CPF_FIRST_MULTIPLIERS;
    this.secondDigitMultipliers = CPF_SECOND_MULTIPLIERS;
  }

  public clean(input: string): string {
    return removeNonDigits(stripDocumentFormatting(input));
  }

  public format(input: string): string | null {
    const cleaned = this.clean(input);

    if (cleaned.length !== CPF_LENGTH) return null;

    const part1 = cleaned.slice(0, 3);
    const part2 = cleaned.slice(3, 6);
    const part3 = cleaned.slice(6, 9);
    const part4 = cleaned.slice(9, 11);

    return `${part1}.${part2}.${part3}-${part4}`;
  }

  public validate(input: string): ValidationResult {
    const stringGuard = guardIsString(input);

    const notEmptyGuard = stringGuard.isValid
      ? guardNotEmpty(stringGuard.cleanedInput as string)
      : stringGuard;

    const baseGuard = chainGuards(stringGuard, notEmptyGuard);
    if (!baseGuard.isValid) return invalidResult(baseGuard.error);

    const cleaned = this.clean(baseGuard.cleanedInput as string);
    const charGuard = guardValidCharacters(cleaned, CPF_ALLOWED_CHARS_REGEX);
    const lengthGuard = guardLength(cleaned, CPF_LENGTH, ERROR_MESSAGES.INVALID_CPF_LENGTH);

    const structureGuard: GuardResult = CPF_ALPHANUMERIC_REGEX.test(cleaned)
      ? { isValid: true, cleanedInput: cleaned }
      : { isValid: false, error: ERROR_MESSAGES.INVALID_CHARACTERS };

    const patternGuard: GuardResult =
      CPF_DIGIT_REGEX.test(cleaned) && INVALID_CPF_PATTERNS.has(cleaned)
        ? { isValid: false, error: ERROR_MESSAGES.INVALID_CPF_PATTERN }
        : { isValid: true, cleanedInput: cleaned };

    const finalGuard = chainGuards(charGuard, lengthGuard, structureGuard, patternGuard);

    return finalGuard.isValid ? this.validateCheckDigits(cleaned) : invalidResult(finalGuard.error);
  }

  public weakValidate(input: string): ValidationResult {
    const stringGuard = guardIsString(input);

    const notEmptyGuard = stringGuard.isValid
      ? guardNotEmpty(stringGuard.cleanedInput as string)
      : stringGuard;

    const baseGuard = chainGuards(stringGuard, notEmptyGuard);

    if (!baseGuard.isValid) return invalidResult(baseGuard.error);

    const cleaned = this.clean(baseGuard.cleanedInput as string);
    const charGuard = guardValidCharacters(cleaned, CPF_ALLOWED_CHARS_REGEX);
    const lengthGuard = guardLength(cleaned, CPF_LENGTH, ERROR_MESSAGES.INVALID_CPF_LENGTH);

    const structureGuard: GuardResult = CPF_ALPHANUMERIC_REGEX.test(cleaned)
      ? { isValid: true, cleanedInput: cleaned }
      : { isValid: false, error: ERROR_MESSAGES.INVALID_CHARACTERS };

    const patternGuard: GuardResult =
      CPF_DIGIT_REGEX.test(cleaned) && INVALID_CPF_PATTERNS.has(cleaned)
        ? { isValid: false, error: ERROR_MESSAGES.INVALID_CPF_PATTERN }
        : { isValid: true, cleanedInput: cleaned };

    const finalGuard = chainGuards(charGuard, lengthGuard, structureGuard, patternGuard);

    return finalGuard.isValid ? validResult() : invalidResult(finalGuard.error);
  }

  private validateCheckDigits(cpf: string): ValidationResult {
    const values = stringToDigitArray(cpf);
    const firstProvided = Number(cpf[CPF_FIRST_DIGIT_POSITION]);
    const secondProvided = Number(cpf[CPF_SECOND_DIGIT_POSITION]);

    const firstDigit = calculateCheckDigit(
      values.slice(0, CPF_FIRST_DIGIT_POSITION),
      this.firstDigitMultipliers,
    );

    if (firstDigit !== firstProvided) return invalidResult(ERROR_MESSAGES.INVALID_CPF_DIGITS);

    const secondDigit = calculateCheckDigit(
      [...values.slice(0, CPF_FIRST_DIGIT_POSITION), firstDigit],
      this.secondDigitMultipliers,
    );

    if (secondDigit !== secondProvided) return invalidResult(ERROR_MESSAGES.INVALID_CPF_DIGITS);

    return validResult();
  }
}

const cpfValidatorInstance = new CPFValidator();

export function validateCPF(input: string): ValidationResult {
  return cpfValidatorInstance.validate(input);
}

export function weakValidateCPF(input: string): ValidationResult {
  return cpfValidatorInstance.weakValidate(input);
}

export function formatCPF(input: string, options?: FormatOptions): string | null {
  const shouldValidate = options?.validate === true;
  const isInvalidWhenStrict = shouldValidate && !cpfValidatorInstance.validate(input).isValid;

  if (isInvalidWhenStrict) return null;

  return cpfValidatorInstance.format(input);
}

export function cleanCPF(input: string): string {
  return cpfValidatorInstance.clean(input);
}

export function maskCPF(input: string, options?: FormatOptions): string | null {
  const shouldValidate = options?.validate === true;
  const isInvalidWhenStrict = shouldValidate && !cpfValidatorInstance.validate(input).isValid;

  if (isInvalidWhenStrict) return null;

  const cleaned = cpfValidatorInstance.clean(input);

  if (cleaned.length !== CPF_LENGTH) return null;

  const prefix = cleaned.slice(0, 3);
  const suffix = cleaned.slice(9, 11);

  return `${prefix}.***.***-${suffix}`;
}
