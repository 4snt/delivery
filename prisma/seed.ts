import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  const adicionaisPath = path.join(__dirname, '../data/adicionais.json');
  const saboresPath = path.join(__dirname, '../data/sabores.json');

  const adicionaisData = JSON.parse(fs.readFileSync(adicionaisPath, 'utf-8'));
  const saboresData = JSON.parse(fs.readFileSync(saboresPath, 'utf-8'));

  console.log(`📦 Inserindo ${adicionaisData.length} adicionais...`);
  for (const adicional of adicionaisData) {
    await prisma.adicional.upsert({
      where: { id: adicional.id },
      update: { nome: adicional.nome },
      create: {
        id: adicional.id,
        nome: adicional.nome,
      },
    });
  }
  console.log('✅ Adicionais inseridos com sucesso!');

  console.log(`🍕 Inserindo ${saboresData.length} sabores...`);
  for (const sabor of saboresData) {
    await prisma.sabor.upsert({
      where: { id: sabor.id },
      update: {
        nome: sabor.nome,
        imagem: sabor.imagem,
      },
      create: {
        id: sabor.id,
        nome: sabor.nome,
        imagem: sabor.imagem,
      },
    });
  }
  console.log('✅ Sabores inseridos com sucesso!');

  // Criar usuário admin padrão
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
  
  console.log('✅ Admin criado com sucesso!');
  console.log('📧 Email: admin@delivery.com');
  console.log('🔑 Senha: admin123');
  console.log('');
  console.log('⚠️  IMPORTANTE: Altere a senha do admin em produção!');
  console.log('');
  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });