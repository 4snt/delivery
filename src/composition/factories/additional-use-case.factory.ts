import { PrismaClient } from '@prisma/client';
import { ListAllAdditionalsUseCase } from '@/core/application/use-cases/additional/list-all-additionals.use-case';
import { GetAdditionalByIdUseCase } from '@/core/application/use-cases/additional/get-additional-by-id.use-case';
import { PrismaAdditionalRepository } from '@/infrastructure/database/prisma/repositories/prisma-additional.repository';

/**
 * Additional Use Cases Factory
 */

const prisma = new PrismaClient();
const additionalRepository = new PrismaAdditionalRepository(prisma);

export const makeListAllAdditionalsUseCase = () => {
  return new ListAllAdditionalsUseCase(additionalRepository);
};

export const makeGetAdditionalByIdUseCase = () => {
  return new GetAdditionalByIdUseCase(additionalRepository);
};
