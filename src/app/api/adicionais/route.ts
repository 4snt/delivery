
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { serializeBigInt } from '@/lib/serializeBigInt';

export async function GET() {
  const adicionais = await prisma.adicional.findMany();
  return NextResponse.json(serializeBigInt(adicionais));
}

export async function POST(request: Request) {
  try {
    const { nome } = await request.json();
    const novoAdicional = await prisma.adicional.create({
      data: {
        nome,
      },
    });
    return NextResponse.json(serializeBigInt(novoAdicional), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao adicionar adicional' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') as string);

    if (!id) {
      return NextResponse.json({ message: "ID obrigatório" }, { status: 400 });
    }

    await prisma.adicional.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Adicional removido com sucesso" });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao remover adicional' }, { status: 500 });
  }
}
