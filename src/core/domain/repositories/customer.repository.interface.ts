import { Customer } from '../entities/customer.entity';

/**
 * Customer Repository Interface - Domain Layer
 * Define o contrato para persistência de clientes
 * Seguindo o princípio de Inversão de Dependência (SOLID)
 */
export interface ICustomerRepository {
  create(customer: Customer): Promise<Customer>;
  findById(id: number): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
  findAll(): Promise<Customer[]>;
  update(id: number, data: Partial<Customer>): Promise<Customer>;
  delete(id: number): Promise<void>;
}
