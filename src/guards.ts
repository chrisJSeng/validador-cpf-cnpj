import { ERROR_MESSAGES, INTERNAL_MESSAGES } from './constants';
import { GuardResult } from './types';

function guardValid(cleanedInput: string): GuardResult {
  return {
    isValid: true,
    cleanedInput,
  };
}

function guardInvalid(error: string): GuardResult {
  return {
    isValid: false,
    error,
  };
}

export function guardIsString(input: unknown): GuardResult {
  if (typeof input !== 'string') return guardInvalid(ERROR_MESSAGES.INVALID_TYPE);

  return guardValid(input);
}

export function guardNotEmpty(input: string): GuardResult {
  const trimmedInput = input.trim();

  if (trimmedInput.length === 0) return guardInvalid(ERROR_MESSAGES.EMPTY_INPUT);

  return guardValid(trimmedInput);
}

export function guardValidCharacters(input: string, allowedChars: RegExp): GuardResult {
  if (!allowedChars.test(input)) return guardInvalid(ERROR_MESSAGES.INVALID_CHARACTERS);

  return guardValid(input);
}

export function guardLength(
  input: string,
  expectedLength: number,
  errorMessage: string,
): GuardResult {
  if (input.length !== expectedLength) return guardInvalid(errorMessage);

  return guardValid(input);
}

export function chainGuards(...guards: GuardResult[]): GuardResult {
  if (guards.length === 0) throw new Error(INTERNAL_MESSAGES.CHAIN_GUARDS_REQUIRES_AT_LEAST_ONE);

  for (const guard of guards) {
    if (!guard.isValid) {
      return guard;
    }
  }

  return guards.at(-1) as GuardResult;
}
