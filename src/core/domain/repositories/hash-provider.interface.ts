/**
 * Hash Provider Interface - Domain Layer
 * Define o contrato para serviços de criptografia
 */
export interface IHashProvider {
  hash(value: string): Promise<string>;
  compare(value: string, hash: string): Promise<boolean>;
}
