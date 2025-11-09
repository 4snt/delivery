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
 * GET /api/v1/admin/dashboard/stats
 * Get dashboard statistics
 */
export async function GET() {
  return controller.getDashboardStats();
}
