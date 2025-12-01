import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { serializeBigInt } from '@/lib/serializeBigInt';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clienteId = searchParams.get('clienteId');

  if (!clienteId) {
    return NextResponse.json({ error: 'clienteId é obrigatório' }, { status: 400 });
  }

  const favoritos = await prisma.favorito.findMany({
    where: { clienteId: BigInt(clienteId) },
    include: {
      sabores: { include: { sabor: true } as any },
      adicionais: { include: { adicional: true } as any },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(serializeBigInt(favoritos));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clienteId, nome, tamanho, preco, sabores, adicionais } = body;

    if (!clienteId || !nome || !tamanho) {
      return NextResponse.json(
        { error: 'clienteId, nome e tamanho são obrigatórios' },
        { status: 400 }
      );
    }

    const favorito = await prisma.favorito.create({
      data: {
        clienteId: BigInt(clienteId),
        nome,
        tamanho,
        preco: preco ?? 0,
        sabores: {
          create: (sabores || []).map((s: any) => ({
            sabor: { connect: { id: BigInt(s.id) } },
          })),
        },
        adicionais: {
          create: (adicionais || []).map((a: any) => ({
            adicional: { connect: { id: BigInt(a.id) } },
          })),
        },
      },
      include: {
        sabores: { include: { sabor: true } as any },
        adicionais: { include: { adicional: true } as any },
      },
    });

    return NextResponse.json(serializeBigInt(favorito), { status: 201 });
  } catch (error) {
    console.error('[POST /api/v1/favorites]', error);
    return NextResponse.json(
      { error: 'Erro ao salvar favorito' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'id é obrigatório' }, { status: 400 });
  }

  await prisma.favorito.delete({
    where: { id: BigInt(id) },
  });

  return NextResponse.json({ ok: true });
}
