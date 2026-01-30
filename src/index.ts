/**
 * Main entry point for the Brazilian document validator library
 * Provides modular exports following best practices
 */

// Export validators
export { CPFValidator, validateCPF, formatCPF, cleanCPF } from './cpf-validator';
export { CNPJValidator, validateCNPJ, formatCNPJ, cleanCNPJ } from './cnpj-validator';

// Export types
export { ValidationResult, DocumentType, IDocumentValidator } from './types';

// Export constants for advanced use cases
export {
  CPF_LENGTH,
  CPF_FORMATTED_LENGTH,
  CNPJ_LENGTH,
  CNPJ_FORMATTED_LENGTH,
  ERROR_MESSAGES,
} from './constants';

// Export guards for custom validation scenarios
export {
  guardIsString,
  guardNotEmpty,
  guardValidCharacters,
  guardLength,
  chainGuards,
} from './guards';
