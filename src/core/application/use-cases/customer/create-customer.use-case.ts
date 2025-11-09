import { Either, left, right } from '@/shared/either/either';
import { DuplicateError, ValidationError } from '@/shared/errors/app-error';
import { Customer } from '@/core/domain/entities/customer.entity';
import { ICustomerRepository } from '@/core/domain/repositories/customer.repository.interface';
import { IHashProvider } from '@/core/domain/repositories/hash-provider.interface';

/**
 * Create Customer Use Case
 * Responsável pela lógica de criação de clientes
 */

interface CreateCustomerRequest {
  name: string;
  email: string;
  password: string;
}

type CreateCustomerResponse = Either<
  DuplicateError | ValidationError,
  Customer
>;

export class CreateCustomerUseCase {
  constructor(
    private customerRepository: ICustomerRepository,
    private hashProvider: IHashProvider
  ) {}

  async execute(
    request: CreateCustomerRequest
  ): Promise<CreateCustomerResponse> {
    const { name, email, password } = request;

    // Validação
    if (!name || !email || !password) {
      return left(new ValidationError('Name, email and password are required'));
    }

    // Verifica se o cliente já existe
    const customerExists = await this.customerRepository.findByEmail(email);
    if (customerExists) {
      return left(new DuplicateError('Customer with this email'));
    }

    // Hash da senha
    const hashedPassword = await this.hashProvider.hash(password);

    // Cria o cliente
    const customer = Customer.create({
      name,
      email,
      password: hashedPassword,
    });

    const createdCustomer = await this.customerRepository.create(customer);

    return right(createdCustomer);
  }
}
