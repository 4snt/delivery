import { Either, left, right } from '@/shared/either/either';
import { NotFoundError } from '@/shared/errors/app-error';
import { Customer } from '@/core/domain/entities/customer.entity';
import { ICustomerRepository } from '@/core/domain/repositories/customer.repository.interface';

/**
 * Get Customer By Id Use Case
 */

interface GetCustomerByIdRequest {
  id: number;
}

type GetCustomerByIdResponse = Either<NotFoundError, Customer>;

export class GetCustomerByIdUseCase {
  constructor(private customerRepository: ICustomerRepository) {}

  async execute(
    request: GetCustomerByIdRequest
  ): Promise<GetCustomerByIdResponse> {
    const { id } = request;

    const customer = await this.customerRepository.findById(id);

    if (!customer) {
      return left(new NotFoundError('Customer'));
    }

    return right(customer);
  }
}
