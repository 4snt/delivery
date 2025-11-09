import { Either, left, right } from '@/shared/either/either';
import { NotFoundError } from '@/shared/errors/app-error';
import { Additional } from '@/core/domain/entities/additional.entity';
import { IAdditionalRepository } from '@/core/domain/repositories/additional.repository.interface';

/**
 * Get Additional By Id Use Case
 */

interface GetAdditionalByIdRequest {
  id: number;
}

type GetAdditionalByIdResponse = Either<NotFoundError, Additional>;

export class GetAdditionalByIdUseCase {
  constructor(private additionalRepository: IAdditionalRepository) {}

  async execute(
    request: GetAdditionalByIdRequest
  ): Promise<GetAdditionalByIdResponse> {
    const { id } = request;

    const additional = await this.additionalRepository.findById(id);

    if (!additional) {
      return left(new NotFoundError('Additional'));
    }

    return right(additional);
  }
}
