import { NextResponse } from 'next/server';
import { signClienteToken } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    const { email, nome } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    // Gera o token JWT
    const token = signClienteToken({ email, nome });

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error('Erro ao gerar token JWT:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar token de autenticação' },
      { status: 500 }
    );
  }
}
