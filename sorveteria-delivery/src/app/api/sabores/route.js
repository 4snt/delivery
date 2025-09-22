import fs from 'fs';
import path from 'path';

// Dados padrão caso o arquivo não seja encontrado
const saboresPadrao = [
  { id: 1, nome: "Chocolate", imagem: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center" },
  { id: 2, nome: "Morango", imagem: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop&crop=center" },
  { id: 3, nome: "Baunilha", imagem: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop&crop=center" },
  { id: 4, nome: "Napolitano", imagem: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center" },
  { id: 5, nome: "Flocos", imagem: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop&crop=center" },
  { id: 6, nome: "Doce de Leite", imagem: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center" },
  { id: 7, nome: "Limão", imagem: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop&crop=center" }
];

let sabores = saboresPadrao;

// Função para carregar sabores
function carregarSabores() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'sabores.json');
    console.log('Tentando carregar sabores de:', filePath);
    
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      sabores = JSON.parse(data);
      console.log('Sabores carregados do arquivo:', sabores.length);
    } else {
      console.log('Arquivo não encontrado, usando dados padrão');
      // Criar o arquivo com dados padrão
      const dirPath = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      fs.writeFileSync(filePath, JSON.stringify(saboresPadrao, null, 2));
      console.log('Arquivo sabores.json criado com dados padrão');
    }
  } catch (error) {
    console.error('Erro ao carregar sabores:', error);
    sabores = saboresPadrao;
  }
}

// Carregar sabores na inicialização
carregarSabores();

export async function GET() {
  console.log('GET /api/sabores - retornando:', sabores);
  return Response.json(sabores);
}

export async function POST(request) {
  try {
    const novoSabor = await request.json();
    novoSabor.id = Date.now();
    sabores.push(novoSabor);
    
    const filePath = path.join(process.cwd(), 'data', 'sabores.json');
    fs.writeFileSync(filePath, JSON.stringify(sabores, null, 2));
    
    return Response.json(novoSabor, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Erro ao adicionar sabor' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));
    
    if (!id) {
      return Response.json({ message: "ID obrigatório" }, { status: 400 });
    }
    
    const index = sabores.findIndex(s => s.id === id);
    if (index === -1) {
      return Response.json({ message: "Sabor não encontrado" }, { status: 404 });
    }
    
    const removido = sabores.splice(index, 1)[0];
    
    const filePath = path.join(process.cwd(), 'data', 'sabores.json');
    fs.writeFileSync(filePath, JSON.stringify(sabores, null, 2));
    
    return Response.json(removido);
  } catch (error) {
    return Response.json({ error: 'Erro ao remover sabor' }, { status: 500 });
  }
}
