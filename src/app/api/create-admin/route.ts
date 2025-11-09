import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

/**
 * API para criar admin em produção
 * ⚠️ REMOVER APÓS CRIAR O PRIMEIRO ADMIN
 */
export async function POST(request: Request) {
  try {
    const { secret, email, password, name } = await request.json();
    
    // Validar secret
    if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid secret' }, 
        { status: 401 }
      );
    }

    // Verificar se já existe
    const exists = await prisma.cliente.findUnique({
      where: { email },
    });

    if (exists) {
      return NextResponse.json(
        { error: 'Admin with this email already exists' },
        { status: 400 }
      );
    }

    // Criar hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Criar admin
    const admin = await prisma.cliente.create({
      data: {
        email,
        nome: name,
        senha: hashedPassword,
        isAdmin: true,
      } as any,
    });

    return NextResponse.json({ 
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.nome,
        isAdmin: (admin as any).isAdmin,
      }
    });
  } catch (error: any) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
