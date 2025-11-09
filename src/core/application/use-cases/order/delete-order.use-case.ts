import { Either, left, right } from '@/shared/either/either';
import { NotFoundError, ValidationError } from '@/shared/errors/app-error';
import { IOrderRepository } from '@/core/domain/repositories/order.repository.interface';

/**
 * Delete Order Use Case
 */

interface DeleteOrderRequest {
  id: number;
}

type DeleteOrderResponse = Either<NotFoundError | ValidationError, void>;

export class DeleteOrderUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(request: DeleteOrderRequest): Promise<DeleteOrderResponse> {
    const { id } = request;

    if (!id) {
      return left(new ValidationError('ID is required'));
    }

    const order = await this.orderRepository.findById(id);
    if (!order) {
      return left(new NotFoundError('Order'));
    }

    await this.orderRepository.delete(id);

    return right(undefined);
  }
}
