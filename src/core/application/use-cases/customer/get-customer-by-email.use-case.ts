import { Either, left, right } from '@/shared/either/either';
import { NotFoundError } from '@/shared/errors/app-error';
import { Customer } from '@/core/domain/entities/customer.entity';
import { ICustomerRepository } from '@/core/domain/repositories/customer.repository.interface';

/**
 * Get Customer By Email Use Case
 */

interface GetCustomerByEmailRequest {
  email: string;
}

type GetCustomerByEmailResponse = Either<NotFoundError, Customer>;

export class GetCustomerByEmailUseCase {
  constructor(private customerRepository: ICustomerRepository) {}

  async execute(
    request: GetCustomerByEmailRequest
  ): Promise<GetCustomerByEmailResponse> {
    const { email } = request;

    const customer = await this.customerRepository.findByEmail(email);

    if (!customer) {
      return left(new NotFoundError('Customer'));
    }

    return right(customer);
  }
}
