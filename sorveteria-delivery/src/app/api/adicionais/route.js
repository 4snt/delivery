import fs from 'fs';
import path from 'path';

// Dados padrão caso o arquivo não seja encontrado
const adicionaisPadrao = [
  { id: 1, nome: "Granulado" },
  { id: 2, nome: "Calda de Chocolate" },
  { id: 3, nome: "Calda de Morango" },
  { id: 4, nome: "Paçoca" },
  { id: 5, nome: "Leite Condensado" },
  { id: 6, nome: "Castanha" },
  { id: 7, nome: "Chantilly" }
];

let adicionais = adicionaisPadrao;

// Função para carregar adicionais
function carregarAdicionais() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'adicionais.json');
    console.log('Tentando carregar adicionais de:', filePath);
    
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      adicionais = JSON.parse(data);
      console.log('Adicionais carregados do arquivo:', adicionais.length);
    } else {
      console.log('Arquivo não encontrado, usando dados padrão');
      // Criar o arquivo com dados padrão
      const dirPath = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      fs.writeFileSync(filePath, JSON.stringify(adicionaisPadrao, null, 2));
      console.log('Arquivo adicionais.json criado com dados padrão');
    }
  } catch (error) {
    console.error('Erro ao carregar adicionais:', error);
    adicionais = adicionaisPadrao;
  }
}

// Carregar adicionais na inicialização
carregarAdicionais();

export async function GET() {
  console.log('GET /api/adicionais - retornando:', adicionais);
  return Response.json(adicionais);
}

export async function POST(request) {
  try {
    const novoAdicional = await request.json();
    novoAdicional.id = Date.now();
    adicionais.push(novoAdicional);
    
    const filePath = path.join(process.cwd(), 'data', 'adicionais.json');
    fs.writeFileSync(filePath, JSON.stringify(adicionais, null, 2));
    
    return Response.json(novoAdicional, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Erro ao adicionar adicional' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));
    
    if (!id) {
      return Response.json({ message: "ID obrigatório" }, { status: 400 });
    }
    
    const index = adicionais.findIndex(a => a.id === id);
    if (index === -1) {
      return Response.json({ message: "Adicional não encontrado" }, { status: 404 });
    }
    
    const removido = adicionais.splice(index, 1)[0];
    
    const filePath = path.join(process.cwd(), 'data', 'adicionais.json');
    fs.writeFileSync(filePath, JSON.stringify(adicionais, null, 2));
    
    return Response.json(removido);
  } catch (error) {
    return Response.json({ error: 'Erro ao remover adicional' }, { status: 500 });
  }
}
