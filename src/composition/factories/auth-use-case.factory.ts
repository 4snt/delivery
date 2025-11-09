import { PrismaClient } from '@prisma/client';
import { AuthenticateCustomerUseCase } from '@/core/application/use-cases/auth/authenticate-customer.use-case';
import { PrismaCustomerRepository } from '@/infrastructure/database/prisma/repositories/prisma-customer.repository';
import { BCryptHashProvider } from '@/infrastructure/cryptography/bcrypt-hash-provider';
import { JWTTokenProvider } from '@/infrastructure/cryptography/jwt-token-provider';

/**
 * Auth Use Cases Factory
 */

const prisma = new PrismaClient();
const customerRepository = new PrismaCustomerRepository(prisma);
const hashProvider = new BCryptHashProvider();
const tokenProvider = new JWTTokenProvider();

export const makeAuthenticateCustomerUseCase = () => {
  return new AuthenticateCustomerUseCase(
    customerRepository,
    hashProvider,
    tokenProvider
  );
};
