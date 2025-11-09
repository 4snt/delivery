import { Additional } from '../entities/additional.entity';

/**
 * Additional Repository Interface - Domain Layer
 * Define o contrato para persistência de adicionais
 */
export interface IAdditionalRepository {
  create(additional: Additional): Promise<Additional>;
  findById(id: number): Promise<Additional | null>;
  findAll(): Promise<Additional[]>;
  update(id: number, data: Partial<Additional>): Promise<Additional>;
  delete(id: number): Promise<void>;
}
