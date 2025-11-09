import { IAdditionalRepository } from '@/core/domain/repositories/additional.repository.interface';
import { Additional } from '@/core/domain/entities/additional.entity';
import { PrismaClient } from '@prisma/client';

/**
 * Prisma Additional Repository Implementation
 */
export class PrismaAdditionalRepository implements IAdditionalRepository {
  constructor(private prisma: PrismaClient) {}

  async create(additional: Additional): Promise<Additional> {
    const created = await this.prisma.adicional.create({
      data: {
        nome: additional.name,
      },
    });

    return Additional.create({
      id: Number(created.id),
      name: created.nome,
    });
  }

  async findById(id: number): Promise<Additional | null> {
    const additional = await this.prisma.adicional.findUnique({
      where: { id: BigInt(id) },
    });

    if (!additional) return null;

    return Additional.create({
      id: Number(additional.id),
      name: additional.nome,
    });
  }

  async findAll(): Promise<Additional[]> {
    const additionals = await this.prisma.adicional.findMany();

    return additionals.map((additional: any) =>
      Additional.create({
        id: Number(additional.id),
        name: additional.nome,
      })
    );
  }

  async update(id: number, data: Partial<Additional>): Promise<Additional> {
    const updateData: any = {};
    if (data.name) updateData.nome = data.name;

    const updated = await this.prisma.adicional.update({
      where: { id: BigInt(id) },
      data: updateData,
    });

    return Additional.create({
      id: Number(updated.id),
      name: updated.nome,
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.adicional.delete({
      where: { id: BigInt(id) },
    });
  }
}
