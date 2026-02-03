export const CPF_FIXTURES = Object.freeze({
  valid: '11144477735',
  formatted: '111.444.777-35',
  masked: '111.***.***-35',
  otherValids: Object.freeze(['52998224725', '00000000191']),
  wrongLength: '123456789',
  invalidChars: 'ABCDEF123JK',
  invalidPatternAllOnes: '11111111111',
  invalidPatternAllZeros: '00000000000',
  invalidDigits: Object.freeze({
    first: '11144477736',
    second: '11144477734',
    both: '12345678901',
  }),
});

export const CNPJ_FIXTURES = Object.freeze({
  valid: '11222333000181',
  formatted: '11.222.333/0001-81',
  otherValids: Object.freeze(['11444777000161', '00000000000191']),
  wrongLength: '123456789',
  invalidPatternAllOnes: '11111111111111',
  invalidPatternAllZeros: '00000000000000',
  invalidDigits: Object.freeze({
    first: '11222333000182',
    second: '11222333000180',
    both: '11222333000100',
  }),
  alphanumeric: Object.freeze({
    base12: '1A23B45C678D',
    mixedFormatted: '1a.23B.45c/678d-42',
    mixedCleaned: '1A23B45C678D42',
    lastTwoNotDigits: '1A.23B.45C/678D-MN',
  }),
});

export const GUARD_FIXTURES = Object.freeze({
  someText: 'test',
  cpfFormattedExample: '123.456.789-01',
  cpfDigitsExample: '12345678901',
  cnpjFormattedExample: '12.345.678/0001-90',
  cnpjDigitsExample: '12345678000190',
});
