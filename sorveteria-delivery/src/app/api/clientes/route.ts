
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
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
      
      return NextResponse.json(cliente);
    }
    const clientes = await prisma.cliente.findMany({
      select: {
        id: true,
        email: true,
        nome: true,
        // senha não é retornada
      },
    });
    return NextResponse.json(clientes);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return NextResponse.json({ error: 'Erro ao buscar clientes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { nome, email, senha } = await request.json();
    
    if (!nome || !email || !senha) {
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
      return NextResponse.json(
        { error: 'Cliente com este email já existe' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(senha, 10);
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
    return NextResponse.json(novoCliente, { status: 201 });
  } catch (error) {
    console.error('Erro ao adicionar cliente:', error);
    return NextResponse.json({ error: 'Erro ao adicionar cliente' }, { status: 500 });
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
        return NextResponse.json(clienteSemSenha);
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        return NextResponse.json({ error: 'Erro ao atualizar cliente' }, { status: 500 });
    }
}


export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') as string);

    if (!id) {
      return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
    }

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
    console.error('Erro ao remover cliente:', error);
    return NextResponse.json({ error: 'Erro ao remover cliente' }, { status: 500 });
  }
}
