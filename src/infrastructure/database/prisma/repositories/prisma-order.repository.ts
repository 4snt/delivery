import { IOrderRepository } from '@/core/domain/repositories/order.repository.interface';
import { Order } from '@/core/domain/entities/order.entity';
import { PrismaClient } from '@prisma/client';

/**
 * Prisma Order Repository Implementation
 */
export class PrismaOrderRepository implements IOrderRepository {
  constructor(private prisma: PrismaClient) {}

  async create(order: Order): Promise<Order> {
    const created: any = await this.prisma.pedido.create({
      data: {
        clienteId: BigInt(order.customerId),
        tamanho: order.size,
        valorTotal: order.totalValue,
        descontoAplicado: order.discountValue,
        cupomCodigo: order.couponCode || undefined,
        formaPagamento: order.paymentMethod,
        enderecoEntrega: order.deliveryAddress,
        status: order.status || "Pendente",
        sabores: {
          create: order.flavorIds.map((flavorId) => ({
            saborId: BigInt(flavorId)
          })) as any,
        },
        adicionais: {
          create: order.additionalIds.map((additionalId) => ({
            adicionalId: BigInt(additionalId)
          })) as any,
        },
      },
      include: {
        sabores: true,
        adicionais: true,
      },
    });

    return Order.create({
      id: Number(created.id),
      customerId: Number(created.clienteId),
      flavorIds: created.sabores.map((s: any) => Number(s.saborId)),
      additionalIds: created.adicionais.map((a: any) => Number(a.adicionalId)),
      size: created.tamanho,
      totalValue: created.valorTotal,
      paymentMethod: created.formaPagamento,
      discountValue: created.descontoAplicado,
      couponCode: created.cupomCodigo,
      deliveryAddress: created.enderecoEntrega,
      status: created.status,
      createdAt: created.createdAt,
    });
  }

  async findById(id: number): Promise<Order | null> {
    const order = await this.prisma.pedido.findUnique({
      where: { id: BigInt(id) },
      include: {
        sabores: true,
        adicionais: true,
      },
    });

    if (!order) return null;

    return Order.create({
      id: Number(order.id),
      customerId: Number(order.clienteId),
      flavorIds: order.sabores.map((s: any) => Number(s.saborId)),
      additionalIds: order.adicionais.map((a: any) => Number(a.adicionalId)),
      size: order.tamanho,
      totalValue: order.valorTotal,
      paymentMethod: order.formaPagamento,
      discountValue: order.descontoAplicado,
      couponCode: order.cupomCodigo,
      deliveryAddress: order.enderecoEntrega,
      status: order.status,
      createdAt: order.createdAt,
    });
  }

  async findAll(): Promise<Order[]> {
    const orders = await this.prisma.pedido.findMany({
      include: {
        sabores: true,
        adicionais: true,
      },
    });

    return orders.map((order: any) =>
      Order.create({
        id: Number(order.id),
        customerId: Number(order.clienteId),
        flavorIds: order.sabores.map((s: any) => Number(s.saborId)),
        additionalIds: order.adicionais.map((a: any) => Number(a.adicionalId)),
        size: order.tamanho,
        totalValue: order.valorTotal,
      paymentMethod: order.formaPagamento,
      discountValue: order.descontoAplicado,
      couponCode: order.cupomCodigo,
      deliveryAddress: order.enderecoEntrega,
        status: order.status,
        createdAt: order.createdAt,
      })
    );
  }

  async findByCustomerId(customerId: number): Promise<Order[]> {
    const orders = await this.prisma.pedido.findMany({
      where: { clienteId: BigInt(customerId) },
      include: {
        sabores: true,
        adicionais: true,
      },
    });

    return orders.map((order: any) =>
      Order.create({
        id: Number(order.id),
        customerId: Number(order.clienteId),
        flavorIds: order.sabores.map((s: any) => Number(s.saborId)),
        additionalIds: order.adicionais.map((a: any) => Number(a.adicionalId)),
        size: order.tamanho,
        totalValue: order.valorTotal,
        paymentMethod: order.formaPagamento,
        deliveryAddress: order.enderecoEntrega,
        status: order.status,
        createdAt: order.createdAt,
      })
    );
  }

  async update(id: number, data: Partial<Order>): Promise<Order> {
    const updateData: any = {};
    if (data.size) updateData.tamanho = data.size;
    if (data.totalValue) updateData.valorTotal = data.totalValue;
    if (data.discountValue !== undefined) updateData.descontoAplicado = data.discountValue;
    if (data.couponCode !== undefined) updateData.cupomCodigo = data.couponCode;
    if (data.paymentMethod) updateData.formaPagamento = data.paymentMethod;
    if (data.deliveryAddress) updateData.enderecoEntrega = data.deliveryAddress;
    if (data.status) updateData.status = data.status;

    const updated = await this.prisma.pedido.update({
      where: { id: BigInt(id) },
      data: updateData,
      include: {
        sabores: true,
        adicionais: true,
      },
    });

    return Order.create({
      id: Number(updated.id),
      customerId: Number(updated.clienteId),
      flavorIds: updated.sabores.map((s: any) => Number(s.saborId)),
      additionalIds: updated.adicionais.map((a: any) => Number(a.adicionalId)),
      size: updated.tamanho,
      totalValue: updated.valorTotal,
      paymentMethod: updated.formaPagamento,
      deliveryAddress: updated.enderecoEntrega,
      status: updated.status,
      createdAt: updated.createdAt,
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.pedido.delete({
      where: { id: BigInt(id) },
    });
  }
}
