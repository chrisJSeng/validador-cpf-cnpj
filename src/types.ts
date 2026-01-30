/**
 * Validation result type
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Document type enum
 */
export enum DocumentType {
  CPF = 'CPF',
  CNPJ = 'CNPJ',
}

/**
 * Validator interface following SOLID principles
 */
export interface IDocumentValidator {
  validate(input: string): ValidationResult;
  format(input: string): string | null;
  clean(input: string): string;
}

/**
 * Input guard result type
 */
export interface GuardResult {
  isValid: boolean;
  error?: string;
  cleanedInput?: string;
}
