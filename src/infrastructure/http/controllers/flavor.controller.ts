import { NextResponse } from 'next/server';
import {
  makeListAllFlavorsUseCase,
  makeGetFlavorByIdUseCase,
} from '@/composition/factories/flavor-use-case.factory';

/**
 * Flavor Controller
 */

export class FlavorController {
  static async list() {
    try {
      const useCase = makeListAllFlavorsUseCase();
      const result = await useCase.execute();

      const flavors = result.value;
      return NextResponse.json(flavors.map((f) => f.toJSON()));
    } catch (error) {
      console.error('Error listing flavors:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }

  static async getById(id: number) {
    try {
      const useCase = makeGetFlavorByIdUseCase();
      const result = await useCase.execute({ id });

      if (result.isLeft()) {
        const error = result.value;
        return NextResponse.json({ error: error.message }, { status: 404 });
      }

      const flavor = result.value;
      return NextResponse.json(flavor.toJSON());
    } catch (error) {
      console.error('Error getting flavor:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
}
