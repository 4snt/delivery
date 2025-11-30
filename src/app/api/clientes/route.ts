
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { serializeBigInt } from '@/lib/serializeBigInt';
import bcrypt from 'bcryptjs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    if (email) {
      const cliente = await prisma.cliente.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          nome: true,
          // senha não é retornada
        },
      });
      
      if (!cliente) {
        return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 });
      }
      
      // Converter BigInt para Number
      const clienteResponse = {
        id: Number(cliente.id),
        email: cliente.email,
        nome: cliente.nome,
      };
      
      return NextResponse.json(clienteResponse);
    }
    const clientes = await prisma.cliente.findMany({
      select: {
        id: true,
        email: true,
        nome: true,
        // senha não é retornada
      },
    });
    
    // Converter BigInt para Number em todos os clientes
    const clientesResponse = clientes.map(c => ({
      id: Number(c.id),
      email: c.email,
      nome: c.nome,
    }));
    
    return NextResponse.json(clientesResponse);
  } catch (error) {
    console.error('[API Clientes GET] Erro ao buscar clientes:', error);
    return NextResponse.json({ error: 'Erro ao buscar clientes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { nome, email, senha } = await request.json();
    
    console.log('[API Clientes POST] Dados recebidos:', { nome, email, senhaLength: senha?.length });
    
    if (!nome || !email || !senha) {
      console.log('[API Clientes POST] Erro: Campos obrigatórios faltando');
      return NextResponse.json(
        { error: 'Nome, email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Verifica se o cliente já existe
    const clienteExiste = await prisma.cliente.findUnique({
      where: { email },
    });

    if (clienteExiste) {
      console.log('[API Clientes POST] Erro: Email já existe:', email);
      return NextResponse.json(
        { error: 'Cliente com este email já existe' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(senha, 10);
    console.log('[API Clientes POST] Criando cliente no banco...');
    
    const novoCliente = await prisma.cliente.create({
      data: {
        nome,
        email,
        senha: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        nome: true,
        // senha não é retornada
      },
    });
    
    console.log('[API Clientes POST] Cliente criado com sucesso:', novoCliente.id);
    
    // Converter BigInt para Number na resposta
    const clienteResponse = {
      id: Number(novoCliente.id),
      email: novoCliente.email,
      nome: novoCliente.nome,
    };
    
    return NextResponse.json(clienteResponse, { status: 201 });
  } catch (error: any) {
    console.error('[API Clientes POST] Erro detalhado:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack
    });
    return NextResponse.json({ 
      error: 'Erro ao adicionar cliente',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
    try {
        const { nome, email, senha } = await request.json();
        
        if (!email) {
            return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 });
        }

        // Verifica se o cliente existe
        const clienteExiste = await prisma.cliente.findUnique({
            where: { email },
        });

        if (!clienteExiste) {
            return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 });
        }

        // Prepara os dados para atualização
        const dataToUpdate: any = {};
        if (nome) dataToUpdate.nome = nome;
        if (senha) {
            const hashedPassword = await bcrypt.hash(senha, 10);
            dataToUpdate.senha = hashedPassword;
        }

        const updatedCliente = await prisma.cliente.update({
            where: { email },
            data: dataToUpdate,
        });

        // Remove a senha da resposta
        const { senha: _, ...clienteSemSenha } = updatedCliente;
        return NextResponse.json(serializeBigInt(clienteSemSenha));
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        return NextResponse.json({ error: 'Erro ao atualizar cliente' }, { status: 500 });
    }
}


export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');

    if (!idParam) {
      return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
    }

    const id = BigInt(idParam);

    // Verifica se o cliente existe
    const clienteExiste = await prisma.cliente.findUnique({
      where: { id },
    });

    if (!clienteExiste) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 });
    }

    await prisma.cliente.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Cliente removido com sucesso" });
  } catch (error) {
    console.error('[API Clientes DELETE] Erro ao remover cliente:', error);
    return NextResponse.json({ error: 'Erro ao remover cliente' }, { status: 500 });
  }
}
