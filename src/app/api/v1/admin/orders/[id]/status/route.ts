import { NextRequest, NextResponse } from 'next/server';
import { AdminController } from '@/infrastructure/http/controllers/admin.controller';
import {
  makeUpdateOrderStatusUseCase,
  makeGetDashboardStatsUseCase,
} from '@/composition/factories/admin-use-case.factory';

const controller = new AdminController(
  makeUpdateOrderStatusUseCase(),
  makeGetDashboardStatsUseCase()
);

/**
 * PATCH /api/v1/admin/orders/[id]/status
 * Update order status
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const body = await request.json();
  
  // Cria um novo request com o body modificado incluindo o ID
  const modifiedBody = { ...body, orderId: id };
  const modifiedRequest = new NextRequest(request.url, {
    method: request.method,
    headers: request.headers,
    body: JSON.stringify(modifiedBody),
  });

  return controller.updateOrderStatus(modifiedRequest);
}
