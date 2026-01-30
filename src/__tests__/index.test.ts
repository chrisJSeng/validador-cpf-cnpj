import * as index from '../index';

describe('Index exports', () => {
  it('should export CPFValidator', () => {
    expect(index.CPFValidator).toBeDefined();
    const validator = new index.CPFValidator();
    expect(validator).toBeInstanceOf(index.CPFValidator);
  });

  it('should export validateCPF', () => {
    expect(index.validateCPF).toBeDefined();
    const result = index.validateCPF('11144477735');
    expect(result.isValid).toBe(true);
  });

  it('should export formatCPF', () => {
    expect(index.formatCPF).toBeDefined();
    const result = index.formatCPF('11144477735');
    expect(result).toBe('111.444.777-35');
  });

  it('should export cleanCPF', () => {
    expect(index.cleanCPF).toBeDefined();
    const result = index.cleanCPF('111.444.777-35');
    expect(result).toBe('11144477735');
  });

  it('should export CNPJValidator', () => {
    expect(index.CNPJValidator).toBeDefined();
    const validator = new index.CNPJValidator();
    expect(validator).toBeInstanceOf(index.CNPJValidator);
  });

  it('should export validateCNPJ', () => {
    expect(index.validateCNPJ).toBeDefined();
    const result = index.validateCNPJ('11222333000181');
    expect(result.isValid).toBe(true);
  });

  it('should export formatCNPJ', () => {
    expect(index.formatCNPJ).toBeDefined();
    const result = index.formatCNPJ('11222333000181');
    expect(result).toBe('11.222.333/0001-81');
  });

  it('should export cleanCNPJ', () => {
    expect(index.cleanCNPJ).toBeDefined();
    const result = index.cleanCNPJ('11.222.333/0001-81');
    expect(result).toBe('11222333000181');
  });

  it('should export DocumentType', () => {
    expect(index.DocumentType).toBeDefined();
    expect(index.DocumentType.CPF).toBe('CPF');
    expect(index.DocumentType.CNPJ).toBe('CNPJ');
  });

  it('should export constants', () => {
    expect(index.CPF_LENGTH).toBe(11);
    expect(index.CNPJ_LENGTH).toBe(14);
    expect(index.CPF_FORMATTED_LENGTH).toBe(14);
    expect(index.CNPJ_FORMATTED_LENGTH).toBe(18);
    expect(index.ERROR_MESSAGES).toBeDefined();
    expect(index.ERROR_MESSAGES.INVALID_TYPE).toBeDefined();
  });

  it('should export guards', () => {
    expect(index.guardIsString).toBeDefined();
    expect(index.guardNotEmpty).toBeDefined();
    expect(index.guardValidCharacters).toBeDefined();
    expect(index.guardLength).toBeDefined();
    expect(index.chainGuards).toBeDefined();
  });

  it('should work with exported guards', () => {
    const result = index.guardIsString('test');
    expect(result.isValid).toBe(true);
  });
});
