import { Either, right } from "@/shared/either/either";
import { IOrderRepository } from "@/core/domain/repositories/order.repository.interface";
import { ICustomerRepository } from "@/core/domain/repositories/customer.repository.interface";
import { IFlavorRepository } from "@/core/domain/repositories/flavor.repository.interface";
import { IAdditionalRepository } from "@/core/domain/repositories/additional.repository.interface";

type DashboardStats = {
  totalOrders: number;
  totalCustomers: number;
  totalFlavors: number;
  totalAdditionals: number;
  ordersByStatus: {
    status: string;
    count: number;
  }[];
  recentOrders: {
    id: number;
    customerName: string;
    totalValue: number;
    status: string;
    createdAt: Date;
  }[];
  totalRevenue: number;
};

type GetDashboardStatsResponse = Either<never, { stats: DashboardStats }>;

/**
 * Get Dashboard Stats Use Case
 * 
 * Business Rules:
 * - Return aggregated statistics for admin dashboard
 * - Only admin can access this data
 */
export class GetDashboardStatsUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private customerRepository: ICustomerRepository,
    private flavorRepository: IFlavorRepository,
    private additionalRepository: IAdditionalRepository
  ) {}

  async execute(): Promise<GetDashboardStatsResponse> {
    // Get all data
    const [orders, customers, flavors, additionals] = await Promise.all([
      this.orderRepository.findAll(),
      this.customerRepository.findAll(),
      this.flavorRepository.findAll(),
      this.additionalRepository.findAll(),
    ]);

    // Calculate orders by status
    const ordersByStatus = orders.reduce((acc, order) => {
      const existing = acc.find((item) => item.status === order.status);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ status: order.status, count: 1 });
      }
      return acc;
    }, [] as { status: string; count: number }[]);

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalValue, 0);

    // Get recent orders (last 10)
    const recentOrders = await Promise.all(
      orders
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 10)
        .map(async (order) => {
          const customer = await this.customerRepository.findById(order.customerId);
          return {
            id: order.id,
            customerName: customer?.name || "Cliente não encontrado",
            totalValue: order.totalValue,
            status: order.status,
            createdAt: order.createdAt,
          };
        })
    );

    const stats: DashboardStats = {
      totalOrders: orders.length,
      totalCustomers: customers.length,
      totalFlavors: flavors.length,
      totalAdditionals: additionals.length,
      ordersByStatus,
      recentOrders,
      totalRevenue,
    };

    return right({ stats });
  }
}
