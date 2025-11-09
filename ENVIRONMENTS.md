# 🔧 Ambientes de Desenvolvimento e Produção

Este projeto usa **bancos de dados diferentes** para desenvolvimento e produção:

## 🏠 Desenvolvimento Local (SQLite)

### Setup Rápido
```bash
# Executar script de configuração
./scripts/setup-dev.sh

# OU manualmente:
cp prisma/schema.dev.prisma prisma/schema.prisma
pnpm prisma generate
pnpm prisma db push
pnpm dev
```

### Arquivos Importantes
- **Schema:** `prisma/schema.dev.prisma` (SQLite)
- **Banco:** `prisma/dev.db` (gitignored)
- **ENV:** `DATABASE_URL="file:./dev.db"`

## ☁️ Produção (Vercel + PostgreSQL)

### Setup
1. **Push para GitHub:**
   ```bash
   git push origin main
   ```

2. **Configurar Vercel:**
   - Importe o repositório
   - O schema correto (`prisma/schema.prisma` com PostgreSQL) já está no repo
   - Configure as variáveis de ambiente

3. **Variáveis de Ambiente na Vercel:**
   ```bash
   DATABASE_URL=postgresql://...  # Vercel Postgres
   NEXTAUTH_URL=https://seu-app.vercel.app
   NEXTAUTH_SECRET=<gerar>
   JWT_SECRET=<gerar>
   ADMIN_SECRET=<gerar>
   ```

### Arquivos Importantes
- **Schema:** `prisma/schema.prisma` (PostgreSQL)
- **ENV:** Configurado na Vercel Dashboard

## 🔄 Alternando entre Ambientes

### Para Desenvolvimento Local:
```bash
./scripts/setup-dev.sh
```

### Para Testar Build de Produção Localmente:
```bash
# 1. Configurar PostgreSQL local ou usar Docker
docker run --name postgres -e POSTGRES_PASSWORD=senha -p 5432:5432 -d postgres

# 2. Atualizar .env
DATABASE_URL="postgresql://postgres:senha@localhost:5432/delivery"

# 3. Aplicar migrations
pnpm prisma migrate deploy

# 4. Build
pnpm build
```

## ⚠️ Importante

1. **Nunca commite** o `prisma/schema.dev.prisma` como `prisma/schema.prisma` para produção
2. **O repositório deve ter** `prisma/schema.prisma` com PostgreSQL (para Vercel)
3. **Localmente use** `prisma/schema.dev.prisma` (SQLite)
4. **O script `setup-dev.sh`** faz isso automaticamente

## 📝 Scripts Úteis

```bash
# Desenvolvimento
./scripts/setup-dev.sh          # Configurar ambiente dev
pnpm dev                         # Iniciar dev server

# Produção (teste local)
pnpm build                       # Build de produção
pnpm start                       # Servidor de produção

# Database
pnpm prisma studio              # Interface visual do banco
pnpm prisma db push             # Sync schema (dev)
pnpm prisma migrate deploy      # Apply migrations (prod)
```

## 🐛 Troubleshooting

### Erro: "the URL must start with the protocol postgresql://"
**Solução:** Execute `./scripts/setup-dev.sh` para usar SQLite local

### Erro: "Can't reach database server"
**Solução:** Verifique se o `DATABASE_URL` está correto para seu ambiente

### Build falha na Vercel
**Solução:** Verifique se as variáveis de ambiente estão configuradas corretamente
