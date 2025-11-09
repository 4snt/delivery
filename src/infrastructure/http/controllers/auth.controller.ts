import { NextRequest, NextResponse } from 'next/server';
import { makeAuthenticateCustomerUseCase } from '@/composition/factories/auth-use-case.factory';

/**
 * Auth Controller
 */

export class AuthController {
  static async authenticate(request: NextRequest) {
    try {
      const body = await request.json();
      const { email, password } = body;

      const useCase = makeAuthenticateCustomerUseCase();
      const result = await useCase.execute({ email, password });

      if (result.isLeft()) {
        const error = result.value;
        return NextResponse.json(
          { error: error.message },
          { status: 401 }
        );
      }

      const authResult = result.value;
      return NextResponse.json(authResult);
    } catch (error) {
      console.error('Error authenticating:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
}
