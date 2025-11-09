import { PrismaClient } from '@prisma/client';
import { CreateCustomerUseCase } from '@/core/application/use-cases/customer/create-customer.use-case';
import { GetCustomerByIdUseCase } from '@/core/application/use-cases/customer/get-customer-by-id.use-case';
import { GetCustomerByEmailUseCase } from '@/core/application/use-cases/customer/get-customer-by-email.use-case';
import { ListAllCustomersUseCase } from '@/core/application/use-cases/customer/list-all-customers.use-case';
import { UpdateCustomerUseCase } from '@/core/application/use-cases/customer/update-customer.use-case';
import { DeleteCustomerUseCase } from '@/core/application/use-cases/customer/delete-customer.use-case';
import { PrismaCustomerRepository } from '@/infrastructure/database/prisma/repositories/prisma-customer.repository';
import { BCryptHashProvider } from '@/infrastructure/cryptography/bcrypt-hash-provider';

/**
 * Customer Use Cases Factory
 * Responsável por criar e injetar dependências nos casos de uso de clientes
 */

const prisma = new PrismaClient();
const customerRepository = new PrismaCustomerRepository(prisma);
const hashProvider = new BCryptHashProvider();

export const makeCreateCustomerUseCase = () => {
  return new CreateCustomerUseCase(customerRepository, hashProvider);
};

export const makeGetCustomerByIdUseCase = () => {
  return new GetCustomerByIdUseCase(customerRepository);
};

export const makeGetCustomerByEmailUseCase = () => {
  return new GetCustomerByEmailUseCase(customerRepository);
};

export const makeListAllCustomersUseCase = () => {
  return new ListAllCustomersUseCase(customerRepository);
};

export const makeUpdateCustomerUseCase = () => {
  return new UpdateCustomerUseCase(customerRepository, hashProvider);
};

export const makeDeleteCustomerUseCase = () => {
  return new DeleteCustomerUseCase(customerRepository);
};
