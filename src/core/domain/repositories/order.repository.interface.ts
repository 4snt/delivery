import { Order } from '../entities/order.entity';

/**
 * Order Repository Interface - Domain Layer
 * Define o contrato para persistência de pedidos
 */
export interface IOrderRepository {
  create(order: Order): Promise<Order>;
  findById(id: number): Promise<Order | null>;
  findAll(): Promise<Order[]>;
  findByCustomerId(customerId: number): Promise<Order[]>;
  update(id: number, data: Partial<Order>): Promise<Order>;
  delete(id: number): Promise<void>;
}
