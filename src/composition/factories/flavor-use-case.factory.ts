import { PrismaClient } from '@prisma/client';
import { ListAllFlavorsUseCase } from '@/core/application/use-cases/flavor/list-all-flavors.use-case';
import { GetFlavorByIdUseCase } from '@/core/application/use-cases/flavor/get-flavor-by-id.use-case';
import { PrismaFlavorRepository } from '@/infrastructure/database/prisma/repositories/prisma-flavor.repository';

/**
 * Flavor Use Cases Factory
 */

const prisma = new PrismaClient();
const flavorRepository = new PrismaFlavorRepository(prisma);

export const makeListAllFlavorsUseCase = () => {
  return new ListAllFlavorsUseCase(flavorRepository);
};

export const makeGetFlavorByIdUseCase = () => {
  return new GetFlavorByIdUseCase(flavorRepository);
};
