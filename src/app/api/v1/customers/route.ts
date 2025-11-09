import { NextRequest } from 'next/server';
import { CustomerController } from '@/infrastructure/http/controllers/customer.controller';

/**
 * GET /api/v1/customers - List all customers
 * GET /api/v1/customers?email={email} - Get customer by email
 * POST /api/v1/customers - Create a new customer
 * PUT /api/v1/customers - Update customer
 */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (email) {
    return CustomerController.getByEmail(email);
  }

  return CustomerController.list();
}

export async function POST(request: NextRequest) {
  return CustomerController.create(request);
}

export async function PUT(request: NextRequest) {
  return CustomerController.update(request);
}
