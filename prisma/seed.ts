import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  const adicionaisPath = path.join(__dirname, '../data/adicionais.json');
  const saboresPath = path.join(__dirname, '../data/sabores.json');

  const adicionaisData = JSON.parse(fs.readFileSync(adicionaisPath, 'utf-8'));
  const saboresData = JSON.parse(fs.readFileSync(saboresPath, 'utf-8'));

  for (const adicional of adicionaisData) {
    await prisma.adicional.create({
      data: {
        nome: adicional.nome,
      },
    });
  }

  for (const sabor of saboresData) {
    await prisma.sabor.create({
      data: {
        nome: sabor.nome,
        imagem: sabor.imagem,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });