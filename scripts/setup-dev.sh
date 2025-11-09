#!/bin/bash

# Script para preparar ambiente de desenvolvimento local
echo "🔧 Configurando ambiente de desenvolvimento local..."
echo ""

# 1. Copiar schema SQLite
echo "1️⃣ Usando schema SQLite para desenvolvimento..."
cp prisma/schema.dev.prisma prisma/schema.prisma

# 2. Verificar .env
if grep -q "file:./dev.db" .env; then
  echo "2️⃣ ✅ DATABASE_URL já configurado para SQLite"
else
  echo "2️⃣ ⚠️  Atualizando DATABASE_URL para SQLite..."
  echo 'DATABASE_URL="file:./dev.db"' > .env
fi

# 3. Gerar Prisma Client
echo "3️⃣ Gerando Prisma Client..."
pnpm prisma generate

# 4. Aplicar migrations
echo "4️⃣ Aplicando migrations..."
pnpm prisma db push

# 5. Seed (opcional)
read -p "5️⃣ Deseja popular o banco de dados? (s/n): " seed
if [ "$seed" = "s" ] || [ "$seed" = "S" ]; then
  pnpm prisma db seed
fi

echo ""
echo "✅ Ambiente de desenvolvimento configurado!"
echo ""
echo "Para iniciar o servidor:"
echo "  pnpm dev"
