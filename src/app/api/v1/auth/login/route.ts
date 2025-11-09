import { NextRequest } from 'next/server';
import { AuthController } from '@/infrastructure/http/controllers/auth.controller';

/**
 * POST /api/v1/auth/login - Authenticate customer
 */

export async function POST(request: NextRequest) {
  return AuthController.authenticate(request);
}
