import { MODULO_DIVISOR, MIN_REMAINDER_FOR_ZERO, DIGIT_ZERO } from './constants';

/**
 * Calculates a check digit based on multipliers (used for CPF and CNPJ)
 */
export function calculateCheckDigit(digits: ReadonlyArray<number>, multipliers: ReadonlyArray<number>): number {
  const sum = digits.reduce((acc, digit, index) => acc + digit * multipliers[index], DIGIT_ZERO);
  const remainder = sum % MODULO_DIVISOR;
  return remainder < MIN_REMAINDER_FOR_ZERO ? DIGIT_ZERO : MODULO_DIVISOR - remainder;
}

/**
 * Converts string digits to number array efficiently
 */
export function stringToDigitArray(input: string): ReadonlyArray<number> {
  return Array.from(input, (char) => Number(char));
}

/**
 * Removes all non-digit characters from input
 */
export function removeNonDigits(input: string): string {
  return input.replace(/\D/g, '');
}

/**
 * Checks if all digits in the string are the same
 * Exported for advanced use cases
 */
export function areAllDigitsSame(input: string): boolean {
  const firstChar = input[0];
  return input.split('').every((char) => char === firstChar);
}
