import { Either, left, right } from '@/shared/either/either';
import { InvalidCredentialsError } from '@/shared/errors/app-error';
import { ICustomerRepository } from '@/core/domain/repositories/customer.repository.interface';
import { IHashProvider } from '@/core/domain/repositories/hash-provider.interface';
import { ITokenProvider } from '@/core/domain/repositories/token-provider.interface';

/**
 * Authenticate Customer Use Case
 * Responsável pela autenticação de clientes
 */

interface AuthenticateCustomerRequest {
  email: string;
  password: string;
}

interface AuthenticateCustomerResult {
  token: string;
  customer: {
    id: number;
    name: string;
    email: string;
  };
}

type AuthenticateCustomerResponse = Either<
  InvalidCredentialsError,
  AuthenticateCustomerResult
>;

export class AuthenticateCustomerUseCase {
  constructor(
    private customerRepository: ICustomerRepository,
    private hashProvider: IHashProvider,
    private tokenProvider: ITokenProvider
  ) {}

  async execute(
    request: AuthenticateCustomerRequest
  ): Promise<AuthenticateCustomerResponse> {
    const { email, password } = request;

    // Busca o cliente pelo email
    const customer = await this.customerRepository.findByEmail(email);
    if (!customer) {
      return left(new InvalidCredentialsError());
    }

    // Verifica a senha
    const isPasswordValid = await this.hashProvider.compare(
      password,
      customer.password
    );
    if (!isPasswordValid) {
      return left(new InvalidCredentialsError());
    }

    // Gera o token JWT
    const token = this.tokenProvider.sign({
      sub: customer.id.toString(),
      email: customer.email,
      name: customer.name,
    });

    return right({
      token,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
      },
    });
  }
}
