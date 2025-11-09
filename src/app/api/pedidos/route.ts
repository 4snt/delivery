
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const pedidos = await prisma.pedido.findMany({
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
  return NextResponse.json(pedidos);
}

export async function POST(request: Request) {
  try {
    const { clienteId, sabores, adicionais, tamanho, valorTotal, formaPagamento, enderecoEntrega } = await request.json();

    const novoPedido = await prisma.pedido.create({
      data: {
        cliente: { connect: { id: clienteId } },
        sabores: {
          create: sabores.map((s: { id: number }) => ({
            sabor: { connect: { id: s.id } }
          }))
        },
        adicionais: {
          create: adicionais.map((a: { id: number }) => ({
            adicional: { connect: { id: a.id } }
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

    return NextResponse.json(novoPedido, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao adicionar pedido' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...data } = await request.json();
    const updatedPedido = await prisma.pedido.update({
      where: { id },
      data,
    });
    return NextResponse.json(updatedPedido);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar pedido' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') as string);

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
