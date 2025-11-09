import { NextRequest } from 'next/server';
import { OrderController } from '@/infrastructure/http/controllers/order.controller';

/**
 * GET /api/v1/orders/[id] - Get order by ID
 * DELETE /api/v1/orders/[id] - Delete order
 */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return OrderController.getById(parseInt(id));
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return OrderController.delete(parseInt(id));
}
