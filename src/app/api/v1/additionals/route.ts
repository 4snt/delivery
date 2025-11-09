import { AdditionalController } from '@/infrastructure/http/controllers/additional.controller';

/**
 * GET /api/v1/additionals - List all additionals
 */

export async function GET() {
  return AdditionalController.list();
}
