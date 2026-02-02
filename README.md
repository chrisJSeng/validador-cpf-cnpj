# Validador CPF/CNPJ 🇧🇷

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Coverage](https://img.shields.io/badge/coverage-99%25+-green.svg)](https://github.com/chrisJSeng/validador-cpf-cnpj)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A high-performance, secure, and modular TypeScript library for validating Brazilian documents (CPF and CNPJ).

## 🚀 Features

- ✅ **TypeScript First**: Full type safety and IntelliSense support
- ✅ **High Performance**: Uses efficient data structures (Set, Object.freeze)
- ✅ **Security Focused**: Comprehensive input validation with guard rails
- ✅ **99%+ Test Coverage**: Thoroughly tested with Jest
- ✅ **SOLID Principles**: Clean, maintainable, and extensible architecture
- ✅ **Modern JavaScript**: ES2022 target
- ✅ **Zero Dependencies**: No external runtime dependencies
- ✅ **Modular Design**: Import only what you need
- ✅ **Clear Rules**: CPF is digits-only; CNPJ supports alphanumeric (`0-9`/`A-Z`)

## 📦 Installation

```bash
npm install validador-cpf-cnpj
```

## 🔧 Usage

> Notes
>
> - All public APIs accept **strings only**.
> - CPF is **digits-only** (11 digits after cleaning/format stripping).
> - CNPJ supports **alphanumeric** characters (`0-9` and `A-Z`) and must match the structure `^[0-9A-Z]{12}\d{2}$` after cleaning (last two characters are numeric check digits).

### About the `{ validate: true }` flag

`formatCPF`, `maskCPF`, and `formatCNPJ` are **best-effort by default**:

- They try to clean/format what you pass in.
- If the cleaned value has the wrong length/shape to be formatted, they return `null`.

When you pass `{ validate: true }`, they become **strict**:

- They first run the full validator (`validateCPF`/`validateCNPJ`).
- If the document is invalid, they return `null`.

Use strict mode when you want to **avoid formatting/masking invalid documents** (e.g., in UI output, logs, or API responses).

### Basic CPF Validation

```typescript
import { validateCPF, formatCPF, cleanCPF, maskCPF } from 'validador-cpf-cnpj';

// Validate CPF
const result = validateCPF('111.444.777-35');
if (result.isValid) {
  console.log('Valid CPF!');
} else {
  console.log('Invalid CPF:', result.error);
}

// Format CPF
const formatted = formatCPF('11144477735');
console.log(formatted); // "111.444.777-35"

// Format CPF only if valid
const formattedStrict = formatCPF('12345678901', { validate: true });
console.log(formattedStrict); // null

// Mask CPF (hide middle digits)
const masked = maskCPF('11144477735');
console.log(masked); // "111.***.***-35"

// Mask CPF only if valid
const maskedStrict = maskCPF('12345678901', { validate: true });
console.log(maskedStrict); // null

// Clean CPF (remove formatting)
const cleaned = cleanCPF('111.444.777-35');
console.log(cleaned); // "11144477735"


```

### Basic CNPJ Validation

```typescript
import { validateCNPJ, formatCNPJ, cleanCNPJ } from 'validador-cpf-cnpj';

// Validate CNPJ
const result = validateCNPJ('11.222.333/0001-81');
if (result.isValid) {
  console.log('Valid CNPJ!');
} else {
  console.log('Invalid CNPJ:', result.error);
}

// Format CNPJ
const formatted = formatCNPJ('11222333000181');
console.log(formatted); // "11.222.333/0001-81"

// Format CNPJ only if valid
const formattedStrict = formatCNPJ('11222333000182', { validate: true });
console.log(formattedStrict); // null

// Clean CNPJ (remove formatting)
const cleaned = cleanCNPJ('11.222.333/0001-81');
console.log(cleaned); // "11222333000181"


```

### Advanced Usage with Classes

```typescript
import { CPFValidator, CNPJValidator } from 'validador-cpf-cnpj';

// Using CPF validator class
const cpfValidator = new CPFValidator();
const cpfResult = cpfValidator.validate('111.444.777-35');

// Using CNPJ validator class
const cnpjValidator = new CNPJValidator();
const cnpjResult = cnpjValidator.validate('11.222.333/0001-81');
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
} from 'validador-cpf-cnpj';

// Create custom validation pipeline
const input = '12345678901';
const stripped = stripDocumentFormatting(input);
const guards = chainGuards(
  guardIsString(input),
  guardNotEmpty(input),
  guardValidCharacters(stripped, /^\d+$/),
  guardLength(stripped, 11, 'Must be 11 digits'),
);

if (!guards.isValid) {
  console.error('Validation failed:', guards.error);
}
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
- Uses `Object.freeze()` for immutable constants
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

- `validateCPF(input: string): ValidationResult` - Validates a CPF
- `formatCPF(input: string, options?: { validate?: boolean }): string | null` - Formats a CPF (best-effort by default; strict with `{ validate: true }`)
- `maskCPF(input: string, options?: { validate?: boolean }): string | null` - Masks a CPF as `XXX.***.***-YY` (best-effort by default; strict with `{ validate: true }`)
- `cleanCPF(input: string): string` - Removes formatting from CPF

### CNPJ Functions

- `validateCNPJ(input: string): ValidationResult` - Validates a CNPJ
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
