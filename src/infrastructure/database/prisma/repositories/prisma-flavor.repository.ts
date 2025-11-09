import { IFlavorRepository } from '@/core/domain/repositories/flavor.repository.interface';
import { Flavor } from '@/core/domain/entities/flavor.entity';
import { PrismaClient } from '@prisma/client';

/**
 * Prisma Flavor Repository Implementation
 */
export class PrismaFlavorRepository implements IFlavorRepository {
  constructor(private prisma: PrismaClient) {}

  async create(flavor: Flavor): Promise<Flavor> {
    const created = await this.prisma.sabor.create({
      data: {
        nome: flavor.name,
        imagem: flavor.image,
      },
    });

    return Flavor.create({
      id: Number(created.id),
      name: created.nome,
      image: created.imagem,
    });
  }

  async findById(id: number): Promise<Flavor | null> {
    const flavor = await this.prisma.sabor.findUnique({
      where: { id: BigInt(id) },
    });

    if (!flavor) return null;

    return Flavor.create({
      id: Number(flavor.id),
      name: flavor.nome,
      image: flavor.imagem,
    });
  }

  async findAll(): Promise<Flavor[]> {
    const flavors = await this.prisma.sabor.findMany();

    return flavors.map((flavor: any) =>
      Flavor.create({
        id: Number(flavor.id),
        name: flavor.nome,
        image: flavor.imagem,
      })
    );
  }

  async update(id: number, data: Partial<Flavor>): Promise<Flavor> {
    const updateData: any = {};
    if (data.name) updateData.nome = data.name;
    if (data.image) updateData.imagem = data.image;

    const updated = await this.prisma.sabor.update({
      where: { id: BigInt(id) },
      data: updateData,
    });

    return Flavor.create({
      id: Number(updated.id),
      name: updated.nome,
      image: updated.imagem,
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.sabor.delete({
      where: { id: BigInt(id) },
    });
  }
}
