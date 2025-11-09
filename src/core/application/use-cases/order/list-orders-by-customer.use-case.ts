import { Either, right } from '@/shared/either/either';
import { Order } from '@/core/domain/entities/order.entity';
import { IOrderRepository } from '@/core/domain/repositories/order.repository.interface';

/**
 * List Orders By Customer Use Case
 */

interface ListOrdersByCustomerRequest {
  customerId: number;
}

type ListOrdersByCustomerResponse = Either<never, Order[]>;

export class ListOrdersByCustomerUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(
    request: ListOrdersByCustomerRequest
  ): Promise<ListOrdersByCustomerResponse> {
    const { customerId } = request;

    const orders = await this.orderRepository.findByCustomerId(customerId);
    return right(orders);
  }
}
