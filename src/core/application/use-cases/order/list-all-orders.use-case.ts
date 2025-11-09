import { Either, right } from '@/shared/either/either';
import { Order } from '@/core/domain/entities/order.entity';
import { IOrderRepository } from '@/core/domain/repositories/order.repository.interface';

/**
 * List All Orders Use Case
 */

type ListAllOrdersResponse = Either<never, Order[]>;

export class ListAllOrdersUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(): Promise<ListAllOrdersResponse> {
    const orders = await this.orderRepository.findAll();
    return right(orders);
  }
}
