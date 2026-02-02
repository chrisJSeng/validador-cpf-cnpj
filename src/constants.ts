export const CPF_LENGTH = 11;
export const CPF_FORMATTED_LENGTH = 14;
export const CPF_FIRST_DIGIT_POSITION = 9;
export const CPF_SECOND_DIGIT_POSITION = 10;
export const CPF_FIRST_DIGIT_MULTIPLIER_START = 10;
export const CPF_SECOND_DIGIT_MULTIPLIER_START = 11;
export const CPF_FORMAT_REGEX = /^(\d{3})\.(\d{3})\.(\d{3})-(\d{2})$/;
export const CPF_DIGIT_REGEX = /^\d+$/;
export const CPF_ALLOWED_CHARS_REGEX = /^\d+$/;
export const CPF_ALPHANUMERIC_REGEX = /^\d{11}$/;
export const CPF_FIRST_MULTIPLIERS = Object.freeze([10, 9, 8, 7, 6, 5, 4, 3, 2]);
export const CPF_SECOND_MULTIPLIERS = Object.freeze([11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);

export const CNPJ_LENGTH = 14;
export const CNPJ_FORMATTED_LENGTH = 18;
export const CNPJ_FIRST_DIGIT_POSITION = 12;
export const CNPJ_SECOND_DIGIT_POSITION = 13;
export const CNPJ_FORMAT_REGEX = /^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})-(\d{2})$/;
export const CNPJ_DIGIT_REGEX = /^\d+$/;
export const CNPJ_ALLOWED_CHARS_REGEX = /^[0-9A-Z]+$/;
export const CNPJ_ALPHANUMERIC_REGEX = /^[0-9A-Z]{12}\d{2}$/;

export const CNPJ_FIRST_MULTIPLIERS = Object.freeze([5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
export const CNPJ_SECOND_MULTIPLIERS = Object.freeze([6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

export const MODULO_DIVISOR = 11;
export const MIN_REMAINDER_FOR_ZERO = 2;
export const DIGIT_ZERO = 0;

export const DIGITS_ONLY_REGEX = /^\d+$/;
export const NON_DIGIT_REGEX = /\D/g;
export const DOCUMENT_FORMATTING_REGEX = /[.\-/\s]/g;
export const NON_ALPHANUMERIC_REGEX = /[^0-9A-Za-z]/g;

export const CPF_RULES = Object.freeze({
  LENGTH: CPF_LENGTH,
  FIRST_DIGIT_POSITION: CPF_FIRST_DIGIT_POSITION,
  SECOND_DIGIT_POSITION: CPF_SECOND_DIGIT_POSITION,
  FIRST_MULTIPLIERS: CPF_FIRST_MULTIPLIERS,
  SECOND_MULTIPLIERS: CPF_SECOND_MULTIPLIERS,
  ALLOWED_CHARS_REGEX: CPF_ALLOWED_CHARS_REGEX,
  STRUCTURE_REGEX: CPF_ALPHANUMERIC_REGEX,
  NUMERIC_ONLY_REGEX: CPF_DIGIT_REGEX,
});

export const CNPJ_RULES = Object.freeze({
  LENGTH: CNPJ_LENGTH,
  FIRST_DIGIT_POSITION: CNPJ_FIRST_DIGIT_POSITION,
  SECOND_DIGIT_POSITION: CNPJ_SECOND_DIGIT_POSITION,
  FIRST_MULTIPLIERS: CNPJ_FIRST_MULTIPLIERS,
  SECOND_MULTIPLIERS: CNPJ_SECOND_MULTIPLIERS,
  ALLOWED_CHARS_REGEX: CNPJ_ALLOWED_CHARS_REGEX,
  STRUCTURE_REGEX: CNPJ_ALPHANUMERIC_REGEX,
  NUMERIC_ONLY_REGEX: CNPJ_DIGIT_REGEX,
});

export const CHECK_DIGIT_RULES = Object.freeze({
  MODULO_DIVISOR,
  MIN_REMAINDER_FOR_ZERO,
  DIGIT_ZERO,
});

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

export const ERROR_MESSAGES = Object.freeze({
  INVALID_TYPE: 'Input must be a string',
  EMPTY_INPUT: 'Input cannot be empty',
  INVALID_CPF_LENGTH: 'CPF must have exactly 11 characters',
  INVALID_CNPJ_LENGTH: 'CNPJ must have exactly 14 characters',
  INVALID_CPF_PATTERN: 'CPF contains invalid pattern',
  INVALID_CNPJ_PATTERN: 'CNPJ contains invalid pattern',
  INVALID_CPF_DIGITS: 'CPF verification digits are invalid',
  INVALID_CNPJ_DIGITS: 'CNPJ verification digits are invalid',
  INVALID_CHARACTERS: 'Input contains invalid characters',
});

export const INTERNAL_MESSAGES = Object.freeze({
  CHAIN_GUARDS_REQUIRES_AT_LEAST_ONE: 'chainGuards requires at least one guard',
});
