
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { serializeBigInt } from '@/lib/serializeBigInt';

export async function GET() {
  const sabores = await prisma.sabor.findMany();
  return NextResponse.json(serializeBigInt(sabores));
}

export async function POST(request: Request) {
  try {
    const { nome, imagem } = await request.json();
    const novoSabor = await prisma.sabor.create({
      data: {
        nome,
        imagem,
      },
    });
    return NextResponse.json(serializeBigInt(novoSabor), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao adicionar sabor' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') as string);

    if (!id) {
      return NextResponse.json({ message: "ID obrigatório" }, { status: 400 });
    }

    await prisma.sabor.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Sabor removido com sucesso" });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao remover sabor' }, { status: 500 });
  }
}
