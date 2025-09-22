export const dynamic = 'force-dynamic';

import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'pedidos.json');
let pedidos = [];

// Carrega pedidos do arquivo ao iniciar
function carregarPedidos() {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      pedidos = JSON.parse(data);
    } else {
      pedidos = [];
      const dirPath = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      fs.writeFileSync(filePath, JSON.stringify(pedidos, null, 2));
    }
  } catch (error) {
    pedidos = [];
  }
}

function salvarPedidos() {
  fs.writeFileSync(filePath, JSON.stringify(pedidos, null, 2));
}

carregarPedidos();

export async function GET() {
  return Response.json(pedidos);
}

export async function POST(request) {
  const pedido = await request.json();
  // Gera um id único
  pedido.id = Date.now();
  pedido.status = 'Em preparo';
  pedidos.push(pedido);
  salvarPedidos();
  return Response.json(pedido, { status: 201 });
}

export async function PUT(request) {
  const updatedPedido = await request.json();
  pedidos = pedidos.map(p =>
    p.id === updatedPedido.id ? { ...p, ...updatedPedido } : p
  );
  salvarPedidos();
  return Response.json(updatedPedido);
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return new Response(JSON.stringify({ error: 'ID do pedido é necessário' }), { status: 400 });
  }
  pedidos = pedidos.filter(p => p.id !== parseInt(id, 10));
  salvarPedidos();
  return Response.json({ message: 'Pedido removido com sucesso' });
}