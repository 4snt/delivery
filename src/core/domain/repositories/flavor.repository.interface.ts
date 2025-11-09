import { Flavor } from '../entities/flavor.entity';

/**
 * Flavor Repository Interface - Domain Layer
 * Define o contrato para persistência de sabores
 */
export interface IFlavorRepository {
  create(flavor: Flavor): Promise<Flavor>;
  findById(id: number): Promise<Flavor | null>;
  findAll(): Promise<Flavor[]>;
  update(id: number, data: Partial<Flavor>): Promise<Flavor>;
  delete(id: number): Promise<void>;
}
