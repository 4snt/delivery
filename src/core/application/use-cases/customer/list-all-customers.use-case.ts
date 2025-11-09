import { Either, right } from '@/shared/either/either';
import { Customer } from '@/core/domain/entities/customer.entity';
import { ICustomerRepository } from '@/core/domain/repositories/customer.repository.interface';

/**
 * List All Customers Use Case
 */

type ListAllCustomersResponse = Either<never, Customer[]>;

export class ListAllCustomersUseCase {
  constructor(private customerRepository: ICustomerRepository) {}

  async execute(): Promise<ListAllCustomersResponse> {
    const customers = await this.customerRepository.findAll();
    return right(customers);
  }
}
