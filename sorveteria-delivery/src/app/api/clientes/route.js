import fs from 'fs';
import path from 'path';

let clientes = [];

// Função para carregar clientes
function carregarClientes() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'clientes.json');
    console.log('Tentando carregar clientes de:', filePath);
    
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      clientes = JSON.parse(data);
      console.log('Clientes carregados do arquivo:', clientes.length);
    } else {
      console.log('Arquivo não encontrado, usando array vazio');
      // Criar o arquivo com array vazio
      const dirPath = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
      console.log('Arquivo clientes.json criado');
    }
  } catch (error) {
    console.error('Erro ao carregar clientes:', error);
    clientes = [];
  }
}

// Carregar clientes na inicialização
carregarClientes();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    if (email) {
      const found = clientes.find(c => c.email === email);
      return Response.json(found || null);
    }
    return Response.json(clientes);
  } catch (error) {
    return Response.json({ error: 'Erro ao buscar clientes' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const cliente = await request.json();
    cliente.id = Date.now();
    clientes.push(cliente);
    
    const filePath = path.join(process.cwd(), 'data', 'clientes.json');
    fs.writeFileSync(filePath, JSON.stringify(clientes, null, 2));
    
    return Response.json(cliente, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Erro ao adicionar cliente' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const update = await request.json();
    const filePath = path.join(process.cwd(), 'data', 'clientes.json');

    // upsert by email
    const idx = clientes.findIndex(c => c.email === update.email);
    if (idx >= 0) {
      clientes[idx] = { ...clientes[idx], ...update };
    } else {
      const novo = { id: Date.now(), ...update };
      clientes.push(novo);
    }

    fs.writeFileSync(filePath, JSON.stringify(clientes, null, 2));
    return Response.json(idx >= 0 ? clientes[idx] : clientes[clientes.length - 1]);
  } catch (error) {
    return Response.json({ error: 'Erro ao atualizar cliente' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));
    
    if (!id) {
      return Response.json({ message: "ID obrigatório" }, { status: 400 });
    }
    
    const index = clientes.findIndex(c => c.id === id);
    if (index === -1) {
      return Response.json({ message: "Cliente não encontrado" }, { status: 404 });
    }
    
    const removido = clientes.splice(index, 1)[0];
    
    const filePath = path.join(process.cwd(), 'data', 'clientes.json');
    fs.writeFileSync(filePath, JSON.stringify(clientes, null, 2));
    
    return Response.json(removido);
  } catch (error) {
    return Response.json({ error: 'Erro ao remover cliente' }, { status: 500 });
  }
}
