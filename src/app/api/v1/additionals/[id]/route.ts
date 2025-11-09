import { NextRequest } from 'next/server';
import { AdditionalController } from '@/infrastructure/http/controllers/additional.controller';

/**
 * GET /api/v1/additionals/[id] - Get additional by ID
 */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return AdditionalController.getById(parseInt(id));
}
