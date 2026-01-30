import { ERROR_MESSAGES } from './constants';
import { GuardResult } from './types';

/**
 * Guard to validate input is a string
 */
export function guardIsString(input: unknown): GuardResult {
  if (typeof input !== 'string') {
    return {
      isValid: false,
      error: ERROR_MESSAGES.INVALID_TYPE,
    };
  }

  return {
    isValid: true,
    cleanedInput: input,
  };
}

/**
 * Guard to validate input is not empty
 */
export function guardNotEmpty(input: string): GuardResult {
  const trimmedInput = input.trim();

  if (trimmedInput.length === 0) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.EMPTY_INPUT,
    };
  }

  return {
    isValid: true,
    cleanedInput: trimmedInput,
  };
}

/**
 * Guard to validate input contains only valid characters
 */
export function guardValidCharacters(input: string, allowedChars: RegExp): GuardResult {
  // Remove common formatting characters
  const cleaned = input.replace(/[.\-/]/g, '');

  if (!allowedChars.test(cleaned)) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.INVALID_CHARACTERS,
    };
  }

  return {
    isValid: true,
    cleanedInput: cleaned,
  };
}

/**
 * Guard to validate input length
 */
export function guardLength(
  input: string,
  expectedLength: number,
  errorMessage: string,
): GuardResult {
  if (input.length !== expectedLength) {
    return {
      isValid: false,
      error: errorMessage,
    };
  }

  return {
    isValid: true,
    cleanedInput: input,
  };
}

/**
 * Composite guard that chains multiple guards
 * Returns the last valid guard result or the first invalid one
 */
export function chainGuards(...guards: GuardResult[]): GuardResult {
  if (guards.length === 0) {
    throw new Error('chainGuards requires at least one guard');
  }

  for (const guard of guards) {
    if (!guard.isValid) {
      return guard;
    }
  }

  return guards[guards.length - 1];
}
