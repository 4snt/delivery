import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { serializeBigInt } from '@/lib/serializeBigInt';

export async function GET() {
  const cupons = await prisma.cupom.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(serializeBigInt(cupons));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      codigo,
      descricao,
      tipo,
      valor,
      valorMinimo,
      usoMaximo,
      expiraEm,
      ativo = true,
    } = body;

    if (!codigo || !tipo || !valor) {
      return NextResponse.json(
        { error: 'codigo, tipo e valor são obrigatórios' },
        { status: 400 }
      );
    }

    const novo = await prisma.cupom.upsert({
      where: { codigo },
      update: {
        descricao,
        tipo,
        valor,
        valorMinimo: valorMinimo ?? 0,
        usoMaximo,
        expiraEm: expiraEm ? new Date(expiraEm) : null,
        ativo,
      },
      create: {
        codigo,
        descricao,
        tipo,
        valor,
        valorMinimo: valorMinimo ?? 0,
        usoMaximo,
        expiraEm: expiraEm ? new Date(expiraEm) : null,
        ativo,
      },
    });

    return NextResponse.json(serializeBigInt(novo), { status: 201 });
  } catch (error) {
    console.error('[POST /api/v1/coupons]', error);
    return NextResponse.json(
      { error: 'Erro ao salvar cupom' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { codigo, ativo } = body;

    if (!codigo || ativo === undefined) {
      return NextResponse.json(
        { error: 'codigo e ativo são obrigatórios' },
        { status: 400 }
      );
    }

    const updated = await prisma.cupom.update({
      where: { codigo },
      data: { ativo },
    });

    return NextResponse.json(serializeBigInt(updated));
  } catch (error) {
    console.error('[PATCH /api/v1/coupons]', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar cupom' },
      { status: 500 }
    );
  }
}
