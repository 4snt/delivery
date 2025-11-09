import { NextRequest } from 'next/server';
import { CustomerController } from '@/infrastructure/http/controllers/customer.controller';

/**
 * GET /api/v1/customers/[id] - Get customer by ID
 * DELETE /api/v1/customers/[id] - Delete customer
 */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return CustomerController.getById(request, parseInt(id));
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return CustomerController.delete(parseInt(id));
}
