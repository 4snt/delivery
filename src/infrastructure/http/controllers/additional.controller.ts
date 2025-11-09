import { NextResponse } from 'next/server';
import {
  makeListAllAdditionalsUseCase,
  makeGetAdditionalByIdUseCase,
} from '@/composition/factories/additional-use-case.factory';

/**
 * Additional Controller
 */

export class AdditionalController {
  static async list() {
    try {
      const useCase = makeListAllAdditionalsUseCase();
      const result = await useCase.execute();

      const additionals = result.value;
      return NextResponse.json(additionals.map((a) => a.toJSON()));
    } catch (error) {
      console.error('Error listing additionals:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }

  static async getById(id: number) {
    try {
      const useCase = makeGetAdditionalByIdUseCase();
      const result = await useCase.execute({ id });

      if (result.isLeft()) {
        const error = result.value;
        return NextResponse.json({ error: error.message }, { status: 404 });
      }

      const additional = result.value;
      return NextResponse.json(additional.toJSON());
    } catch (error) {
      console.error('Error getting additional:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
}
