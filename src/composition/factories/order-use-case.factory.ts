import { PrismaClient } from '@prisma/client';
import { CreateOrderUseCase } from '@/core/application/use-cases/order/create-order.use-case';
import { ListAllOrdersUseCase } from '@/core/application/use-cases/order/list-all-orders.use-case';
import { GetOrderByIdUseCase } from '@/core/application/use-cases/order/get-order-by-id.use-case';
import { ListOrdersByCustomerUseCase } from '@/core/application/use-cases/order/list-orders-by-customer.use-case';
import { DeleteOrderUseCase } from '@/core/application/use-cases/order/delete-order.use-case';
import { PrismaOrderRepository } from '@/infrastructure/database/prisma/repositories/prisma-order.repository';

/**
 * Order Use Cases Factory
 */

const prisma = new PrismaClient();
const orderRepository = new PrismaOrderRepository(prisma);

export const makeCreateOrderUseCase = () => {
  return new CreateOrderUseCase(orderRepository);
};

export const makeListAllOrdersUseCase = () => {
  return new ListAllOrdersUseCase(orderRepository);
};

export const makeGetOrderByIdUseCase = () => {
  return new GetOrderByIdUseCase(orderRepository);
};

export const makeListOrdersByCustomerUseCase = () => {
  return new ListOrdersByCustomerUseCase(orderRepository);
};

export const makeDeleteOrderUseCase = () => {
  return new DeleteOrderUseCase(orderRepository);
};
