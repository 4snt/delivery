import { NextRequest, NextResponse } from 'next/server';
import {
  makeCreateCustomerUseCase,
  makeGetCustomerByIdUseCase,
  makeGetCustomerByEmailUseCase,
  makeListAllCustomersUseCase,
  makeUpdateCustomerUseCase,
  makeDeleteCustomerUseCase,
} from '@/composition/factories/customer-use-case.factory';

/**
 * Customer Controller
 * Adapta requisições HTTP para os casos de uso
 */

export class CustomerController {
  static async create(request: NextRequest) {
    try {
      const body = await request.json();
      const { name, email, password } = body;

      const useCase = makeCreateCustomerUseCase();
      const result = await useCase.execute({ name, email, password });

      if (result.isLeft()) {
        const error = result.value;
        return NextResponse.json(
          { error: error.message },
          { status: error.name === 'DuplicateError' ? 409 : 400 }
        );
      }

      const customer = result.value;
      return NextResponse.json(customer.toJSON(), { status: 201 });
    } catch (error) {
      console.error('Error creating customer:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }

  static async getById(request: NextRequest, id: number) {
    try {
      const useCase = makeGetCustomerByIdUseCase();
      const result = await useCase.execute({ id });

      if (result.isLeft()) {
        const error = result.value;
        return NextResponse.json({ error: error.message }, { status: 404 });
      }

      const customer = result.value;
      return NextResponse.json(customer.toJSON());
    } catch (error) {
      console.error('Error getting customer:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }

  static async getByEmail(email: string) {
    try {
      const useCase = makeGetCustomerByEmailUseCase();
      const result = await useCase.execute({ email });

      if (result.isLeft()) {
        const error = result.value;
        return NextResponse.json({ error: error.message }, { status: 404 });
      }

      const customer = result.value;
      return NextResponse.json(customer.toJSON());
    } catch (error) {
      console.error('Error getting customer by email:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }

  static async list() {
    try {
      const useCase = makeListAllCustomersUseCase();
      const result = await useCase.execute();

      const customers = result.value;
      return NextResponse.json(customers.map((c) => c.toJSON()));
    } catch (error) {
      console.error('Error listing customers:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }

  static async update(request: NextRequest) {
    try {
      const body = await request.json();
      const { email, name, password } = body;

      const useCase = makeUpdateCustomerUseCase();
      const result = await useCase.execute({ email, name, password });

      if (result.isLeft()) {
        const error = result.value;
        return NextResponse.json(
          { error: error.message },
          { status: error.name === 'NotFoundError' ? 404 : 400 }
        );
      }

      const customer = result.value;
      return NextResponse.json(customer.toJSON());
    } catch (error) {
      console.error('Error updating customer:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }

  static async delete(id: number) {
    try {
      const useCase = makeDeleteCustomerUseCase();
      const result = await useCase.execute({ id });

      if (result.isLeft()) {
        const error = result.value;
        return NextResponse.json(
          { error: error.message },
          { status: error.name === 'NotFoundError' ? 404 : 400 }
        );
      }

      return NextResponse.json({ message: 'Customer deleted successfully' });
    } catch (error) {
      console.error('Error deleting customer:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
}
