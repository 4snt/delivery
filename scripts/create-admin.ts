import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminUser() {
  const email = 'admin@sorveteria.com';
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const admin = await prisma.cliente.upsert({
      where: { email },
      update: {
        isAdmin: true,
      },
      create: {
        email,
        nome: 'Administrador',
        senha: hashedPassword,
        isAdmin: true,
      },
    });

    console.log('✅ Usuário admin criado/atualizado com sucesso!');
    console.log('📧 Email:', email);
    console.log('🔑 Senha:', password);
    console.log('👤 ID:', admin.id);
  } catch (error) {
    console.error('❌ Erro ao criar usuário admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
