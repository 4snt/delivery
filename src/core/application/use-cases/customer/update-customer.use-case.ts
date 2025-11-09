import { Either, left, right } from '@/shared/either/either';
import { NotFoundError, ValidationError } from '@/shared/errors/app-error';
import { Customer } from '@/core/domain/entities/customer.entity';
import { ICustomerRepository } from '@/core/domain/repositories/customer.repository.interface';
import { IHashProvider } from '@/core/domain/repositories/hash-provider.interface';

/**
 * Update Customer Use Case
 */

interface UpdateCustomerRequest {
  email: string;
  name?: string;
  password?: string;
}

type UpdateCustomerResponse = Either<
  NotFoundError | ValidationError,
  Customer
>;

export class UpdateCustomerUseCase {
  constructor(
    private customerRepository: ICustomerRepository,
    private hashProvider: IHashProvider
  ) {}

  async execute(
    request: UpdateCustomerRequest
  ): Promise<UpdateCustomerResponse> {
    const { email, name, password } = request;

    if (!email) {
      return left(new ValidationError('Email is required'));
    }

    const customer = await this.customerRepository.findByEmail(email);
    if (!customer) {
      return left(new NotFoundError('Customer'));
    }

    const dataToUpdate: any = {};
    if (name) dataToUpdate.name = name;
    if (password) {
      dataToUpdate.password = await this.hashProvider.hash(password);
    }

    const updatedCustomer = await this.customerRepository.update(
      customer.id,
      dataToUpdate
    );

    return right(updatedCustomer);
  }
}
