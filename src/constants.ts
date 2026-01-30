/**
 * Constants for CPF validation
 */
export const CPF_LENGTH = 11;
export const CPF_FORMATTED_LENGTH = 14;
export const CPF_FIRST_DIGIT_POSITION = 9;
export const CPF_SECOND_DIGIT_POSITION = 10;
export const CPF_FIRST_DIGIT_MULTIPLIER_START = 10;
export const CPF_SECOND_DIGIT_MULTIPLIER_START = 11;
export const CPF_FORMAT_REGEX = /^(\d{3})\.(\d{3})\.(\d{3})-(\d{2})$/;
export const CPF_DIGIT_REGEX = /^\d+$/;

/**
 * Constants for CNPJ validation
 */
export const CNPJ_LENGTH = 14;
export const CNPJ_FORMATTED_LENGTH = 18;
export const CNPJ_FIRST_DIGIT_POSITION = 12;
export const CNPJ_SECOND_DIGIT_POSITION = 13;
export const CNPJ_FORMAT_REGEX = /^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})-(\d{2})$/;
export const CNPJ_DIGIT_REGEX = /^\d+$/;

/**
 * Multipliers for CNPJ validation
 */
export const CNPJ_FIRST_MULTIPLIERS = Object.freeze([5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
export const CNPJ_SECOND_MULTIPLIERS = Object.freeze([6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

/**
 * Common constants
 */
export const MODULO_DIVISOR = 11;
export const MIN_REMAINDER_FOR_ZERO = 2;
export const DIGIT_ZERO = 0;

/**
 * Known invalid CPF patterns (all same digits)
 */
export const INVALID_CPF_PATTERNS = Object.freeze(
  new Set([
    '00000000000',
    '11111111111',
    '22222222222',
    '33333333333',
    '44444444444',
    '55555555555',
    '66666666666',
    '77777777777',
    '88888888888',
    '99999999999',
  ]),
);

/**
 * Known invalid CNPJ patterns (all same digits)
 */
export const INVALID_CNPJ_PATTERNS = Object.freeze(
  new Set([
    '00000000000000',
    '11111111111111',
    '22222222222222',
    '33333333333333',
    '44444444444444',
    '55555555555555',
    '66666666666666',
    '77777777777777',
    '88888888888888',
    '99999999999999',
  ]),
);

/**
 * Error messages
 */
export const ERROR_MESSAGES = Object.freeze({
  INVALID_TYPE: 'Input must be a string',
  EMPTY_INPUT: 'Input cannot be empty',
  INVALID_CPF_LENGTH: 'CPF must have exactly 11 digits',
  INVALID_CNPJ_LENGTH: 'CNPJ must have exactly 14 digits',
  INVALID_CPF_PATTERN: 'CPF contains invalid pattern',
  INVALID_CNPJ_PATTERN: 'CNPJ contains invalid pattern',
  INVALID_CPF_DIGITS: 'CPF verification digits are invalid',
  INVALID_CNPJ_DIGITS: 'CNPJ verification digits are invalid',
  INVALID_CHARACTERS: 'Input contains invalid characters',
});
