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
- ✅ **Modern JavaScript**: ES2022+ features
- ✅ **Zero Dependencies**: No external runtime dependencies
- ✅ **Modular Design**: Import only what you need

## 📦 Installation

```bash
npm install validador-cpf-cnpj
```

## 🔧 Usage

### Basic CPF Validation

```typescript
import { validateCPF, formatCPF, cleanCPF } from 'validador-cpf-cnpj';

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
} from 'validador-cpf-cnpj';

// Create custom validation pipeline
const input = '12345678901';
const guards = chainGuards(
  guardIsString(input),
  guardNotEmpty(input),
  guardValidCharacters(input, /^\d+$/),
  guardLength(input, 11, 'Must be 11 digits'),
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
- `formatCPF(input: string): string | null` - Formats a CPF
- `cleanCPF(input: string): string` - Removes formatting from CPF

### CNPJ Functions

- `validateCNPJ(input: string): ValidationResult` - Validates a CNPJ
- `formatCNPJ(input: string): string | null` - Formats a CNPJ
- `cleanCNPJ(input: string): string` - Removes formatting from CNPJ

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
# Run tests
npm test

# Run tests with coverage
npm run test

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

- [CPF Validation Algorithm](https://www.macoratti.net/alg_cpf.htm)
- [CNPJ Validation Algorithm](https://www.macoratti.net/alg_cnpj.htm)
