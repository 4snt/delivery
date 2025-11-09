import { Either, left, right } from '@/shared/either/either';
import { NotFoundError, ValidationError } from '@/shared/errors/app-error';
import { ICustomerRepository } from '@/core/domain/repositories/customer.repository.interface';

/**
 * Delete Customer Use Case
 */

interface DeleteCustomerRequest {
  id: number;
}

type DeleteCustomerResponse = Either<NotFoundError | ValidationError, void>;

export class DeleteCustomerUseCase {
  constructor(private customerRepository: ICustomerRepository) {}

  async execute(
    request: DeleteCustomerRequest
  ): Promise<DeleteCustomerResponse> {
    const { id } = request;

    if (!id) {
      return left(new ValidationError('ID is required'));
    }

    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      return left(new NotFoundError('Customer'));
    }

    await this.customerRepository.delete(id);

    return right(undefined);
  }
}
