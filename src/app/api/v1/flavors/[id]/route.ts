import { NextRequest } from 'next/server';
import { FlavorController } from '@/infrastructure/http/controllers/flavor.controller';

/**
 * GET /api/v1/flavors/[id] - Get flavor by ID
 */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return FlavorController.getById(parseInt(id));
}
