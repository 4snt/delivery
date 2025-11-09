import { Either, right } from '@/shared/either/either';
import { Additional } from '@/core/domain/entities/additional.entity';
import { IAdditionalRepository } from '@/core/domain/repositories/additional.repository.interface';

/**
 * List All Additionals Use Case
 */

type ListAllAdditionalsResponse = Either<never, Additional[]>;

export class ListAllAdditionalsUseCase {
  constructor(private additionalRepository: IAdditionalRepository) {}

  async execute(): Promise<ListAllAdditionalsResponse> {
    const additionals = await this.additionalRepository.findAll();
    return right(additionals);
  }
}
