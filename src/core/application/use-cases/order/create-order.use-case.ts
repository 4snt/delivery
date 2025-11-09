import { Either, left, right } from '@/shared/either/either';
import { ValidationError } from '@/shared/errors/app-error';
import { Order } from '@/core/domain/entities/order.entity';
import { IOrderRepository } from '@/core/domain/repositories/order.repository.interface';

/**
 * Create Order Use Case
 */

interface CreateOrderRequest {
  customerId: number;
  flavorIds: number[];
  additionalIds: number[];
  size: string;
  totalValue: number;
  paymentMethod: string;
  deliveryAddress: string;
}

type CreateOrderResponse = Either<ValidationError, Order>;

export class CreateOrderUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    const {
      customerId,
      flavorIds,
      additionalIds,
      size,
      totalValue,
      paymentMethod,
      deliveryAddress,
    } = request;

    // Validação
    if (!customerId || !size || !paymentMethod || !deliveryAddress) {
      return left(
        new ValidationError(
          'CustomerId, size, paymentMethod and deliveryAddress are required'
        )
      );
    }

    if (!flavorIds || flavorIds.length === 0) {
      return left(new ValidationError('At least one flavor is required'));
    }

    // Cria o pedido
    const order = Order.create({
      customerId,
      flavorIds,
      additionalIds: additionalIds || [],
      size,
      totalValue,
      paymentMethod,
      deliveryAddress,
    });

    const createdOrder = await this.orderRepository.create(order);

    return right(createdOrder);
  }
}
