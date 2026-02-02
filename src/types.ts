export interface ValidationResult {
  isValid: boolean;
  error?: string;
}
export enum DocumentType {
  CPF = 'CPF',
  CNPJ = 'CNPJ',
}
export interface IDocumentValidator {
  validate(input: string): ValidationResult;
  format(input: string): string | null;
  clean(input: string): string;
}
export interface GuardResult {
  isValid: boolean;
  error?: string;
  cleanedInput?: string;
}

export interface FormatOptions {
  validate?: boolean;
}
