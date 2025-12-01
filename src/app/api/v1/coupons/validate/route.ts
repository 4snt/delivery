import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { serializeBigInt } from '@/lib/serializeBigInt';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const codigo = searchParams.get('codigo');
  const valorTotalParam = searchParams.get('valorTotal');

  if (!codigo) {
    return NextResponse.json({ error: 'codigo é obrigatório' }, { status: 400 });
  }

  const cupom = await prisma.cupom.findUnique({
    where: { codigo },
  });

  if (!cupom || !cupom.ativo) {
    return NextResponse.json({ error: 'Cupom inválido ou inativo' }, { status: 404 });
  }

  if (cupom.expiraEm && cupom.expiraEm < new Date()) {
    return NextResponse.json({ error: 'Cupom expirado' }, { status: 400 });
  }

  if (cupom.usoMaximo && cupom.usosAtuais >= cupom.usoMaximo) {
    return NextResponse.json({ error: 'Limite de uso atingido' }, { status: 400 });
  }

  const valorTotal = valorTotalParam ? parseFloat(valorTotalParam) : 0;
  if (cupom.valorMinimo && valorTotal < cupom.valorMinimo) {
    return NextResponse.json(
      { error: `Valor mínimo para o cupom: R$ ${cupom.valorMinimo.toFixed(2)}` },
      { status: 400 }
    );
  }

  const desconto =
    cupom.tipo === 'percentual'
      ? Number(((cupom.valor / 100) * valorTotal).toFixed(2))
      : cupom.valor;

  const totalComDesconto = Math.max(0, valorTotal - desconto);

  return NextResponse.json(serializeBigInt({
    cupom,
    desconto,
    totalComDesconto,
  }));
}
