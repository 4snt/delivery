import { PrismaClient } from '@prisma/client';
import { UpdateOrderStatusUseCase } from '@/core/application/use-cases/admin/update-order-status.use-case';
import { GetDashboardStatsUseCase } from '@/core/application/use-cases/admin/get-dashboard-stats.use-case';
import { PrismaOrderRepository } from '@/infrastructure/database/prisma/repositories/prisma-order.repository';
import { PrismaCustomerRepository } from '@/infrastructure/database/prisma/repositories/prisma-customer.repository';
import { PrismaFlavorRepository } from '@/infrastructure/database/prisma/repositories/prisma-flavor.repository';
import { PrismaAdditionalRepository } from '@/infrastructure/database/prisma/repositories/prisma-additional.repository';
import prisma from '@/lib/prisma';

/**
 * Admin Use Case Factory - Composition Layer
 * Creates admin use cases with their dependencies
 */

export function makeUpdateOrderStatusUseCase(): UpdateOrderStatusUseCase {
  const orderRepository = new PrismaOrderRepository(prisma as unknown as PrismaClient);
  return new UpdateOrderStatusUseCase(orderRepository);
}

export function makeGetDashboardStatsUseCase(): GetDashboardStatsUseCase {
  const orderRepository = new PrismaOrderRepository(prisma as unknown as PrismaClient);
  const customerRepository = new PrismaCustomerRepository(prisma as unknown as PrismaClient);
  const flavorRepository = new PrismaFlavorRepository(prisma as unknown as PrismaClient);
  const additionalRepository = new PrismaAdditionalRepository(prisma as unknown as PrismaClient);

  return new GetDashboardStatsUseCase(
    orderRepository,
    customerRepository,
    flavorRepository,
    additionalRepository
  );
}
