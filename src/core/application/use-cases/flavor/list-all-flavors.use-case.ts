import { Either, right } from '@/shared/either/either';
import { Flavor } from '@/core/domain/entities/flavor.entity';
import { IFlavorRepository } from '@/core/domain/repositories/flavor.repository.interface';

/**
 * List All Flavors Use Case
 */

type ListAllFlavorsResponse = Either<never, Flavor[]>;

export class ListAllFlavorsUseCase {
  constructor(private flavorRepository: IFlavorRepository) {}

  async execute(): Promise<ListAllFlavorsResponse> {
    const flavors = await this.flavorRepository.findAll();
    return right(flavors);
  }
}
