
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { serializeBigInt } from '@/lib/serializeBigInt';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clienteIdParam = searchParams.get('clienteId');
  const idParam = searchParams.get('id');
  const email = searchParams.get('email');
  const where: any = {};

  if (idParam) {
    where.id = BigInt(idParam);
  }

  if (clienteIdParam) {
    where.clienteId = BigInt(clienteIdParam);
  }

  if (email) {
    where.cliente = { email };
  }

  const pedidos = await prisma.pedido.findMany({
    where,
    include: {
      cliente: true,
      sabores: {
        include: {
          sabor: true,
        } as any,
      },
      adicionais: {
        include: {
          adicional: true,
        } as any,
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(serializeBigInt(pedidos));
}

export async function POST(request: Request) {
  try {
    const { clienteId, sabores, adicionais, tamanho, valorTotal, formaPagamento, enderecoEntrega } = await request.json();
    const clienteIdBigInt = BigInt(clienteId);
    const saboresList = Array.isArray(sabores) ? sabores : [];
    const adicionaisList = Array.isArray(adicionais) ? adicionais : [];

    const novoPedido = await prisma.pedido.create({
      data: {
        cliente: { connect: { id: clienteIdBigInt } },
        sabores: {
          create: saboresList.map((s: { id: number }) => ({
            sabor: { connect: { id: BigInt(s.id) } }
          }))
        },
        adicionais: {
          create: adicionaisList.map((a: { id: number }) => ({
            adicional: { connect: { id: BigInt(a.id) } }
          }))
        },
        tamanho,
        valorTotal,
        formaPagamento,
        enderecoEntrega,
      },
      include: {
        cliente: true,
        sabores: {
          include: {
            sabor: true,
          } as any,
        },
        adicionais: {
          include: {
            adicional: true,
          } as any,
        },
      },
    });

    return NextResponse.json(serializeBigInt(novoPedido), { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao adicionar pedido' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...data } = await request.json();
    const idBig = BigInt(id);
    const updatedPedido = await prisma.pedido.update({
      where: { id: idBig },
      data,
      include: {
        cliente: true,
        sabores: { include: { sabor: true } as any },
        adicionais: { include: { adicional: true } as any },
      },
    });
    return NextResponse.json(serializeBigInt(updatedPedido));
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar pedido' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');
    const id = idParam ? BigInt(idParam) : null;

    if (!id) {
      return NextResponse.json({ message: "ID obrigatório" }, { status: 400 });
    }

    await prisma.pedido.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Pedido removido com sucesso" });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao remover pedido' }, { status: 500 });
  }
}
