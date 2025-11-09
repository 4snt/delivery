/**
 * Token Provider Interface - Domain Layer
 * Define o contrato para serviços de autenticação
 */
export interface ITokenProvider {
  sign(payload: Record<string, any>): string;
  verify(token: string): Record<string, any> | null;
}
