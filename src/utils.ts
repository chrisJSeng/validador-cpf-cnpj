import {
  MODULO_DIVISOR,
  MIN_REMAINDER_FOR_ZERO,
  DIGIT_ZERO,
  NON_DIGIT_REGEX,
  DOCUMENT_FORMATTING_REGEX,
  NON_ALPHANUMERIC_REGEX,
} from './constants';
import { ValidationResult } from './types';

export function calculateCheckDigit(
  digits: ReadonlyArray<number>,
  multipliers: ReadonlyArray<number>,
): number {
  const sum = digits.reduce((acc, digit, index) => acc + digit * multipliers[index], DIGIT_ZERO);
  const remainder = sum % MODULO_DIVISOR;

  return remainder < MIN_REMAINDER_FOR_ZERO ? DIGIT_ZERO : MODULO_DIVISOR - remainder;
}

export function stringToDigitArray(input: string): ReadonlyArray<number> {
  return Array.from(input, Number);
}

export function removeNonDigits(input: string): string {
  return input.replaceAll(NON_DIGIT_REGEX, '');
}

export function areAllDigitsSame(input: string): boolean {
  const firstChar = input[0];

  return input.split('').every((char) => char === firstChar);
}

export function stripDocumentFormatting(input: string): string {
  return input.replaceAll(DOCUMENT_FORMATTING_REGEX, '');
}

export function removeNonAlphanumeric(input: string): string {
  return input.replaceAll(NON_ALPHANUMERIC_REGEX, '');
}

export function charToBase36Value(char: string): number {
  return Number.parseInt(char, 36);
}

export function stringToBase36ValueArray(input: string): ReadonlyArray<number> {
  return Array.from(input, (char) => charToBase36Value(char.toUpperCase()));
}

export function validResult(): ValidationResult {
  return { isValid: true };
}

export function invalidResult(error?: string): ValidationResult {
  return { isValid: false, error };
}
