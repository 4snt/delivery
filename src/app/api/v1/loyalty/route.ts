import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { serializeBigInt } from '@/lib/serializeBigInt';

export async function GET() {
  const clientes = await prisma.cliente.findMany({
    select: {
      id: true,
      nome: true,
      email: true,
      pontosFidelidade: true,
      transacoes: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
    orderBy: { nome: 'asc' },
  });

  return NextResponse.json(serializeBigInt(clientes));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clienteId, pontos, tipo, descricao } = body;

    if (!clienteId || !pontos || !tipo) {
      return NextResponse.json(
        { error: 'clienteId, pontos e tipo são obrigatórios' },
        { status: 400 }
      );
    }

    if (!['earn', 'redeem'].includes(tipo)) {
      return NextResponse.json(
        { error: 'tipo deve ser earn ou redeem' },
        { status: 400 }
      );
    }

    const ajuste = tipo === 'redeem' ? -Math.abs(Number(pontos)) : Math.abs(Number(pontos));

    const result = await prisma.$transaction(async (tx) => {
      const cliente = await tx.cliente.update({
        where: { id: BigInt(clienteId) },
        data: {
          pontosFidelidade: {
            increment: ajuste,
          },
        },
      });

      const transacao = await tx.fidelidadeTransacao.create({
        data: {
          clienteId: BigInt(clienteId),
          pontos: ajuste,
          tipo,
          descricao,
        },
      });

      return { cliente, transacao };
    });

    return NextResponse.json(serializeBigInt(result));
  } catch (error) {
    console.error('[POST /api/v1/loyalty]', error);
    return NextResponse.json(
      { error: 'Erro ao registrar pontos' },
      { status: 500 }
    );
  }
}
