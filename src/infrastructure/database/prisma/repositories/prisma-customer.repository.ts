import { ICustomerRepository } from '@/core/domain/repositories/customer.repository.interface';
import { Customer } from '@/core/domain/entities/customer.entity';
import { PrismaClient } from '@prisma/client';

/**
 * Prisma Customer Repository Implementation
 * Implementa a interface ICustomerRepository usando Prisma ORM
 */
export class PrismaCustomerRepository implements ICustomerRepository {
  constructor(private prisma: PrismaClient) {}

  async create(customer: Customer): Promise<Customer> {
    const created = await this.prisma.cliente.create({
      data: {
        nome: customer.name,
        email: customer.email,
        senha: customer.password,
        isAdmin: customer.isAdmin || false,
      } as any,
    });

    return Customer.create({
      id: Number(created.id),
      name: created.nome,
      email: created.email,
      password: created.senha,
      isAdmin: (created as any).isAdmin,
    });
  }

  async findById(id: number): Promise<Customer | null> {
    const customer = await this.prisma.cliente.findUnique({
      where: { id: BigInt(id) },
    });

    if (!customer) return null;

    return Customer.create({
      id: Number(customer.id),
      name: customer.nome,
      email: customer.email,
      password: customer.senha,
      isAdmin: (customer as any).isAdmin,
    });
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const customer = await this.prisma.cliente.findUnique({
      where: { email },
    });

    if (!customer) return null;

    return Customer.create({
      id: Number(customer.id),
      name: customer.nome,
      email: customer.email,
      password: customer.senha,
      isAdmin: (customer as any).isAdmin,
    });
  }

  async findAll(): Promise<Customer[]> {
    const customers = await this.prisma.cliente.findMany();

    return customers.map((customer: any) =>
      Customer.create({
        id: Number(customer.id),
        name: customer.nome,
        email: customer.email,
        password: customer.senha,
        isAdmin: customer.isAdmin,
      })
    );
  }

  async update(id: number, data: Partial<Customer>): Promise<Customer> {
    const updateData: any = {};
    if (data.name) updateData.nome = data.name;
    if (data.email) updateData.email = data.email;
    if (data.password) updateData.senha = data.password;
    if (data.isAdmin !== undefined) updateData.isAdmin = data.isAdmin;

    const updated = await this.prisma.cliente.update({
      where: { id: BigInt(id) },
      data: updateData,
    });

    return Customer.create({
      id: Number(updated.id),
      name: updated.nome,
      email: updated.email,
      password: updated.senha,
      isAdmin: (updated as any).isAdmin,
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.cliente.delete({
      where: { id: BigInt(id) },
    });
  }
}
