import { Either, left, right } from '@/shared/either/either';
import { NotFoundError } from '@/shared/errors/app-error';
import { Flavor } from '@/core/domain/entities/flavor.entity';
import { IFlavorRepository } from '@/core/domain/repositories/flavor.repository.interface';

/**
 * Get Flavor By Id Use Case
 */

interface GetFlavorByIdRequest {
  id: number;
}

type GetFlavorByIdResponse = Either<NotFoundError, Flavor>;

export class GetFlavorByIdUseCase {
  constructor(private flavorRepository: IFlavorRepository) {}

  async execute(request: GetFlavorByIdRequest): Promise<GetFlavorByIdResponse> {
    const { id } = request;

    const flavor = await this.flavorRepository.findById(id);

    if (!flavor) {
      return left(new NotFoundError('Flavor'));
    }

    return right(flavor);
  }
}
