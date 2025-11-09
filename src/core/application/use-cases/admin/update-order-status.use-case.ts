import { Either, left, right } from "@/shared/either/either";
import { NotFoundError, ValidationError } from "@/shared/errors/app-error";
import { IOrderRepository } from "@/core/domain/repositories/order.repository.interface";
import { Order } from "@/core/domain/entities/order.entity";

type UpdateOrderStatusRequest = {
  orderId: number;
  status: string;
};

type UpdateOrderStatusResponse = Either<
  NotFoundError | ValidationError,
  { order: Order }
>;

/**
 * Update Order Status Use Case
 * 
 * Business Rules:
 * - Order must exist
 * - Status must be valid
 * - Only admin can update order status
 */
export class UpdateOrderStatusUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(request: UpdateOrderStatusRequest): Promise<UpdateOrderStatusResponse> {
    const { orderId, status } = request;

    // Validate status
    const validStatuses = [
      "Pendente",
      "Em preparo",
      "Saiu para a entrega",
      "Entregue",
      "Cancelado"
    ];

    if (!validStatuses.includes(status)) {
      return left(
        new ValidationError(
          `Status inválido. Valores aceitos: ${validStatuses.join(", ")}`
        )
      );
    }

    // Check if order exists
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      return left(new NotFoundError("Pedido não encontrado"));
    }

    // Update order status
    const updatedOrder = await this.orderRepository.update(orderId, { status });

    return right({ order: updatedOrder });
  }
}
