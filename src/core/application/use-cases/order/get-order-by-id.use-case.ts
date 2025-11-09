import { Either, left, right } from '@/shared/either/either';
import { NotFoundError } from '@/shared/errors/app-error';
import { Order } from '@/core/domain/entities/order.entity';
import { IOrderRepository } from '@/core/domain/repositories/order.repository.interface';

/**
 * Get Order By Id Use Case
 */

interface GetOrderByIdRequest {
  id: number;
}

type GetOrderByIdResponse = Either<NotFoundError, Order>;

export class GetOrderByIdUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(request: GetOrderByIdRequest): Promise<GetOrderByIdResponse> {
    const { id } = request;

    const order = await this.orderRepository.findById(id);

    if (!order) {
      return left(new NotFoundError('Order'));
    }

    return right(order);
  }
}
