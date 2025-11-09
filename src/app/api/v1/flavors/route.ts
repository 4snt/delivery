import { FlavorController } from '@/infrastructure/http/controllers/flavor.controller';

/**
 * GET /api/v1/flavors - List all ice cream flavors
 */

export async function GET() {
  return FlavorController.list();
}
