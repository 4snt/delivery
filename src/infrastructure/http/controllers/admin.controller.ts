import { NextRequest, NextResponse } from 'next/server';
import { UpdateOrderStatusUseCase } from '@/core/application/use-cases/admin/update-order-status.use-case';
import { GetDashboardStatsUseCase } from '@/core/application/use-cases/admin/get-dashboard-stats.use-case';

/**
 * Admin Controller - Infrastructure Layer
 * Handles HTTP requests for admin operations
 */
export class AdminController {
  constructor(
    private updateOrderStatusUseCase: UpdateOrderStatusUseCase,
    private getDashboardStatsUseCase: GetDashboardStatsUseCase
  ) {}

  async updateOrderStatus(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json();
      const { orderId, status } = body;

      if (!orderId || !status) {
        return NextResponse.json(
          { error: 'orderId e status são obrigatórios' },
          { status: 400 }
        );
      }

      const result = await this.updateOrderStatusUseCase.execute({
        orderId: Number(orderId),
        status,
      });

      if (result.isLeft()) {
        const error = result.value;
        return NextResponse.json(
          { error: error.message },
          { status: error.name === 'NotFoundError' ? 404 : 400 }
        );
      }

      return NextResponse.json(result.value.order.toJSON());
    } catch (error) {
      console.error('[AdminController.updateOrderStatus]', error);
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }
  }

  async getDashboardStats(): Promise<NextResponse> {
    try {
      const result = await this.getDashboardStatsUseCase.execute();

      // GetDashboardStatsUseCase nunca retorna erro (Either<never, ...>)
      // então sempre terá sucesso
      return NextResponse.json(result.value.stats);
    } catch (error) {
      console.error('[AdminController.getDashboardStats]', error);
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }
  }
}
