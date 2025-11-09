import { NextRequest } from 'next/server';
import { OrderController } from '@/infrastructure/http/controllers/order.controller';

/**
 * GET /api/v1/orders - List all orders
 * GET /api/v1/orders?customerId={id} - List orders by customer
 * POST /api/v1/orders - Create a new order
 */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const customerId = searchParams.get('customerId');

  if (customerId) {
    return OrderController.listByCustomer(parseInt(customerId));
  }

  return OrderController.list();
}

export async function POST(request: NextRequest) {
  return OrderController.create(request);
}
