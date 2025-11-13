import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

export async function POST(request: Request) {
  try {
    const { secret } = await request.json();

    // Verificar secret para segurança
    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    console.log('🌱 Iniciando seed do banco de dados...');

    // Ler dados dos arquivos JSON
    const adicionaisPath = path.join(process.cwd(), 'data', 'adicionais.json');
    const saboresPath = path.join(process.cwd(), 'data', 'sabores.json');

    const adicionaisData = JSON.parse(fs.readFileSync(adicionaisPath, 'utf-8'));
    const saboresData = JSON.parse(fs.readFileSync(saboresPath, 'utf-8'));

    // Inserir adicionais
    console.log(`Inserindo ${adicionaisData.length} adicionais...`);
    for (const adicional of adicionaisData) {
      await prisma.adicional.upsert({
        where: { id: BigInt(adicional.id) } as any,
        update: { nome: adicional.nome },
        create: {
          id: BigInt(adicional.id),
          nome: adicional.nome,
        } as any,
      });
    }

    // Inserir sabores
    console.log(`Inserindo ${saboresData.length} sabores...`);
    for (const sabor of saboresData) {
      await prisma.sabor.upsert({
        where: { id: BigInt(sabor.id) } as any,
        update: {
          nome: sabor.nome,
          imagem: sabor.imagem,
        },
        create: {
          id: BigInt(sabor.id),
          nome: sabor.nome,
          imagem: sabor.imagem,
        } as any,
      });
    }

    // Criar admin padrão
    console.log('👤 Criando usuário admin padrão...');
    const adminEmail = 'admin@delivery.com';
    const adminPassword = await bcrypt.hash('admin123', 10);

    await prisma.cliente.upsert({
      where: { email: adminEmail },
      update: {
        isAdmin: true,
      } as any,
      create: {
        email: adminEmail,
        nome: 'Administrador',
        senha: adminPassword,
        isAdmin: true,
      } as any,
    });

    console.log('Seed concluído com sucesso!');

    return NextResponse.json({
      success: true,
      message: 'Seed executado com sucesso!',
      data: {
        adicionais: adicionaisData.length,
        sabores: saboresData.length,
        admin: { email: adminEmail, senha: 'admin123' }
      }
    });

  } catch (error: any) {
    console.error('❌ Erro ao executar seed:', error);
    return NextResponse.json(
      {
        error: 'Erro ao executar seed',
        details: error.message
      },
      { status: 500 }
    );
  }
}
