import { NextRequest, NextResponse } from 'next/server';
import {
  makeCreateOrderUseCase,
  makeListAllOrdersUseCase,
  makeGetOrderByIdUseCase,
  makeListOrdersByCustomerUseCase,
  makeDeleteOrderUseCase,
} from '@/composition/factories/order-use-case.factory';

/**
 * Order Controller
 */

export class OrderController {
  static async create(request: NextRequest) {
    try {
      const body = await request.json();
      const {
        customerId,
        flavorIds,
        additionalIds,
        size,
        totalValue,
        paymentMethod,
        deliveryAddress,
      } = body;

      const useCase = makeCreateOrderUseCase();
      const result = await useCase.execute({
        customerId,
        flavorIds,
        additionalIds,
        size,
        totalValue,
        paymentMethod,
        deliveryAddress,
      });

      if (result.isLeft()) {
        const error = result.value;
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      const order = result.value;
      return NextResponse.json(order.toJSON(), { status: 201 });
    } catch (error) {
      console.error('Error creating order:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }

  static async list() {
    try {
      const useCase = makeListAllOrdersUseCase();
      const result = await useCase.execute();

      const orders = result.value;
      return NextResponse.json(orders.map((o) => o.toJSON()));
    } catch (error) {
      console.error('Error listing orders:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }

  static async getById(id: number) {
    try {
      const useCase = makeGetOrderByIdUseCase();
      const result = await useCase.execute({ id });

      if (result.isLeft()) {
        const error = result.value;
        return NextResponse.json({ error: error.message }, { status: 404 });
      }

      const order = result.value;
      return NextResponse.json(order.toJSON());
    } catch (error) {
      console.error('Error getting order:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }

  static async listByCustomer(customerId: number) {
    try {
      const useCase = makeListOrdersByCustomerUseCase();
      const result = await useCase.execute({ customerId });

      const orders = result.value;
      return NextResponse.json(orders.map((o) => o.toJSON()));
    } catch (error) {
      console.error('Error listing customer orders:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }

  static async delete(id: number) {
    try {
      const useCase = makeDeleteOrderUseCase();
      const result = await useCase.execute({ id });

      if (result.isLeft()) {
        const error = result.value;
        return NextResponse.json(
          { error: error.message },
          { status: error.name === 'NotFoundError' ? 404 : 400 }
        );
      }

      return NextResponse.json({ message: 'Order deleted successfully' });
    } catch (error) {
      console.error('Error deleting order:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
}
