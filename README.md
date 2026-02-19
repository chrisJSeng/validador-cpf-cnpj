# Validador CPF/CNPJ 🇧🇷

[![npm version](https://img.shields.io/npm/v/validador-cnpj-cpf.svg)](https://www.npmjs.com/package/validador-cnpj-cpf)
[![npm downloads](https://img.shields.io/npm/dw/validador-cnpj-cpf.svg)](https://www.npmjs.com/package/validador-cnpj-cpf)
[![license](https://img.shields.io/npm/l/validador-cnpj-cpf.svg)](LICENSE)
[![CI](https://github.com/chrisJSeng/validador-cpf-cnpj/actions/workflows/ci.yml/badge.svg)](https://github.com/chrisJSeng/validador-cpf-cnpj/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/chrisJSeng/validador-cpf-cnpj/branch/main/graph/badge.svg)](https://codecov.io/gh/chrisJSeng/validador-cpf-cnpj)
[![Security - Snyk](https://github.com/chrisJSeng/validador-cpf-cnpj/actions/workflows/security-snyk.yml/badge.svg)](https://github.com/chrisJSeng/validador-cpf-cnpj/actions/workflows/security-snyk.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)

A high-performance, secure, and modular TypeScript library for validating Brazilian documents (CPF and CNPJ).

## 🚀 Features

- ✅ **TypeScript First**: Full type safety and IntelliSense support
- ✅ **High Performance**: Uses efficient data structures
- ✅ **Security Focused**: Comprehensive input validation with guard rails
- ✅ **99%+ Test Coverage**: Thoroughly tested with Jest
- ✅ **SOLID Principles**: Clean, maintainable, and extensible architecture
- ✅ **Modern JavaScript**: ES2022 target
- ✅ **Zero Dependencies**: No external runtime dependencies
- ✅ **Modular Design**: Import only what you need
- ✅ **Clear Rules**: CPF is digits-only; CNPJ supports alphanumeric (`0-9`/`A-Z`)

## 📦 Installation

```bash
npm install validador-cnpj-cpf
```

## 🔧 Usage

> Notes
>
> - All public APIs accept **strings only**.
> - CPF is **digits-only** (11 digits after cleaning/format stripping).
> - CNPJ supports **alphanumeric** characters (`0-9` and `A-Z`) and, after cleaning, must have **14 characters**: the **first 12** can be `0-9`/`A-Z`, and the **last 2** must be **numeric digits** (check digits).
> - **Weak validation** checks **structure only** (allowed characters + length/shape) and **skips check digits**. This exists to support dev/QA and real-world transition/migration scenarios (e.g., alphanumeric CNPJ adoption) where the check digit verification may be unavailable, inconsistent, or intentionally ignored.

### CPF

Weak validation for CPF exists mainly for **dev/QA** (mock data) and cases where you want to accept an input that **looks like a CPF** (digits-only + correct length) without requiring valid check digits.

```typescript
import { validateCPF, weakValidateCPF } from 'validador-cnpj-cpf';

const strictValid = validateCPF('111.444.777-35')// { isValid: true };

// Same input, different behavior
const strictInvalid = validateCPF('123.456.789-01')// { isValid: false, error: string };
const weakValid = validateCPF('123.456.789-01', { weak: true })// { isValid: true };

// Dedicated weak function (same as validateCPF(..., { weak: true }))
const weak1 = weakValidateCPF('123.456.789-01')// { isValid: true };
const weakInvalid = weakValidateCPF('123.456.78A-01')// { isValid: false, error: string };

const envWeak = validateCPF('123.456.789-01', { weak: process.env.NODE_ENV !== 'production' })// { isValid: boolean, error?: string };
```

```typescript
import { formatCPF, maskCPF, cleanCPF } from 'validador-cnpj-cpf';

const formatted = formatCPF('11144477735')// "111.444.777-35";
const formattedStrict = formatCPF('12345678901', { validate: true })// null;

const masked = maskCPF('11144477735')// "111.***.***-35";
const maskedStrict = maskCPF('12345678901', { validate: true })// null;

const cleaned = cleanCPF('111.444.777-35')// "11144477735";
```

### CNPJ

Weak validation for CNPJ is useful during the **alphanumeric transition** and integrations where you must accept a CNPJ that matches the official **structure** but cannot (or should not) enforce check digits.

```typescript
import { validateCNPJ, weakValidateCNPJ } from 'validador-cnpj-cpf';

const strictValid = validateCNPJ('11.222.333/0001-81')// { isValid: true };

// Same input, different behavior
const strictInvalid = validateCNPJ('NZ.83Y.1JX/0001-69')// { isValid: false, error: string };
const weakValid = validateCNPJ('NZ.83Y.1JX/0001-69', { weak: true })// { isValid: true };

// Weak validation still rejects invalid structure (last 2 must be numeric digits)
const weakInvalid = weakValidateCNPJ('1A.23B.45C/678D-MN')// { isValid: false, error: string };

// Dedicated weak function (same as validateCNPJ(..., { weak: true }))
const weak1 = weakValidateCNPJ('NZ.83Y.1JX/0001-69')// { isValid: true };

const envWeak = validateCNPJ('NZ.83Y.1JX/0001-69', { weak: process.env.NODE_ENV !== 'production' })// { isValid: boolean, error?: string };
```

```typescript
import { formatCNPJ, cleanCNPJ } from 'validador-cnpj-cpf';

const formatted = formatCNPJ('11222333000181')// "11.222.333/0001-81";
const formattedStrict = formatCNPJ('11222333000182', { validate: true })// null;

const cleaned = cleanCNPJ('11.222.333/0001-81')// "11222333000181";

// Alphanumeric CNPJ: letters are preserved and uppercased
const formattedAlpha = formatCNPJ('nz.83y.1jx/0001-69')// "NZ.83Y.1JX/0001-69";
const cleanedAlpha = cleanCNPJ('nz.83y.1jx/0001-69')// "NZ83Y1JX000169";

// Strict formatting requires valid check digits
const formattedAlphaStrict = formatCNPJ('NZ.83Y.1JX/0001-69', { validate: true })// null;
```

### Custom Validation with Guards

```typescript
import {
  guardIsString,
  guardNotEmpty,
  guardValidCharacters,
  guardLength,
  chainGuards,
  stripDocumentFormatting,
} from 'validador-cnpj-cpf';

const input = '12345678901';
const stripped = stripDocumentFormatting(input)// "12345678901";
const guards = chainGuards(
  guardIsString(input),
  guardNotEmpty(input),
  guardValidCharacters(stripped, /^\d+$/),
  guardLength(stripped, 11, 'Must be 11 digits'),
);

// guards: { isValid: boolean, error?: string }
```

## 🏗️ Architecture

This library follows best practices and design principles:

### SOLID Principles

- **Single Responsibility**: Each validator handles one document type
- **Open/Closed**: Extensible via interfaces without modifying existing code
- **Liskov Substitution**: Validators implement common interfaces
- **Interface Segregation**: Minimal, focused interfaces
- **Dependency Inversion**: Depends on abstractions, not concretions

### DRY, KISS, YAGNI

- **DRY (Don't Repeat Yourself)**: Shared utilities and constants
- **KISS (Keep It Simple, Stupid)**: Clear, straightforward implementations
- **YAGNI (You Aren't Gonna Need It)**: Only implements necessary features

### Performance Optimizations

- Uses `Set` for O(1) invalid pattern lookups
- Pre-calculates multipliers for check digit validation
- Efficient array operations with modern JavaScript

## 🛡️ Security

- Comprehensive input validation with guard rails
- Type-safe TypeScript implementation
- No eval() or unsafe operations
- Sanitizes all user inputs
- Prevents common attack vectors

## 📊 API Reference

### Validation Result

```typescript
interface ValidationResult {
  isValid: boolean;
  error?: string;
}
```

### CPF Functions

- `validateCPF(input: string, options?: { weak?: boolean }): ValidationResult` - Validates a CPF. Pass `{ weak: true }` to skip check digit verification
- `weakValidateCPF(input: string): ValidationResult` - Validates CPF structure only (alias for `validateCPF(input, { weak: true })`)
- `formatCPF(input: string, options?: { validate?: boolean }): string | null` - Formats a CPF (best-effort by default; strict with `{ validate: true }`)
- `maskCPF(input: string, options?: { validate?: boolean }): string | null` - Masks a CPF as `XXX.***.***-YY` (best-effort by default; strict with `{ validate: true }`)
- `cleanCPF(input: string): string` - Removes formatting from CPF

### CNPJ Functions

- `validateCNPJ(input: string, options?: { weak?: boolean }): ValidationResult` - Validates a CNPJ. Pass `{ weak: true }` to skip check digit verification
- `weakValidateCNPJ(input: string): ValidationResult` - Validates CNPJ structure only (alias for `validateCNPJ(input, { weak: true })`)
- `formatCNPJ(input: string, options?: { validate?: boolean }): string | null` - Formats a CNPJ (best-effort by default; strict with `{ validate: true }`)
- `cleanCNPJ(input: string): string` - Removes formatting from CNPJ

### Utils

- `stripDocumentFormatting(input: string): string` - Removes `.`, `-`, `/` and whitespace

### Classes

- `CPFValidator` - Class-based CPF validator implementing `IDocumentValidator`
- `CNPJValidator` - Class-based CNPJ validator implementing `IDocumentValidator`

### Guards

- `guardIsString(input: unknown): GuardResult`
- `guardNotEmpty(input: string): GuardResult`
- `guardValidCharacters(input: string, regex: RegExp): GuardResult`
- `guardLength(input: string, length: number, error: string): GuardResult`
- `chainGuards(...guards: GuardResult[]): GuardResult`

## 🧪 Testing

The library includes comprehensive test coverage (99%+) with tests organized by functionality:

- **cpf-validator.test.ts** - CPF validation, formatting, and weak validation tests
- **cnpj-validator.test.ts** - CNPJ validation, formatting, alphanumeric support, and weak validation tests
- **guards.test.ts** - Input validation guard tests
- **utils.test.ts** - Utility function tests
- **index.test.ts** - Integration tests

Weak validation tests are integrated into the existing test files, making it easy to compare behavior between strict and weak validation modes.

```bash
# Run tests (includes coverage)
npm test

# Watch mode
npm run test:watch
```

## 🔨 Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Lint
npm run lint

# Format
npm run format
```

## 📝 License

MIT © [chrisJSeng]

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📚 References

- Receita Federal (gov.br) — Meu CPF: https://www.gov.br/receitafederal/pt-br/assuntos/meu-cpf
- gov.br — Consultar Cadastro de Pessoa Física (CPF) na Receita Federal: https://www.gov.br/pt-br/servicos/consultar-cadastro-de-pessoas-fisicas
- Receita Federal (gov.br) — CNPJ (Cadastro Nacional de Pessoas Jurídicas): https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/cadastros/cnpj
- Receita Federal — IN RFB nº 2.119/2022 (Cadastro Nacional da Pessoa Jurídica – CNPJ): https://normasinternet2.receita.fazenda.gov.br/#/consulta/externa/127567
