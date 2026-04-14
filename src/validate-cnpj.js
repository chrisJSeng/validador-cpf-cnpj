#!/usr/bin/env node
const { validateCNPJ } = require('./cnpj-validator');

const input = process.argv[2];
if (!input) {
  console.error('Usage: validate-cnpj <CNPJ>');
  process.exit(1);
}

const result = validateCNPJ(input);
console.log(result);

if (!result.isValid) process.exit(1);