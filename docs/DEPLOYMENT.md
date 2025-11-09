# 🚀 Guia de Deploy

Este documento descreve como fazer deploy da aplicação no Vercel com PostgreSQL (Neon).

## 📋 Pré-requisitos

- Conta no [Vercel](https://vercel.com)
- Conta no [Neon](https://neon.tech) (PostgreSQL serverless)
- Repositório no GitHub

## 🐘 1. Configurar Neon Database

### Criar Projeto no Neon

1. Acesse [console.neon.tech](https://console.neon.tech)
2. Crie um novo projeto
3. Anote as credenciais geradas:
   - `POSTGRES_PRISMA_URL` (pooled connection)
   - `POSTGRES_URL_NON_POOLED` (direct connection)
   - `POSTGRES_URL`
   - `POSTGRES_HOST`
   - Outras variáveis PGUSER, PGPASSWORD, etc.

### Integração com Vercel

Neon oferece integração automática com Vercel:

1. No dashboard do Neon, vá em **Integrations**
2. Conecte com Vercel
3. Selecione o projeto Vercel
4. As variáveis serão adicionadas automaticamente

## 🌐 2. Configurar Vercel

### Importar Projeto

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Importe o repositório do GitHub
3. Configure as variáveis de ambiente

### Variáveis de Ambiente Obrigatórias

Se não usou a integração automática do Neon, adicione manualmente:

```bash
# Database (Neon)
POSTGRES_PRISMA_URL="postgresql://user:pass@host.neon.tech/db?sslmode=require"
POSTGRES_URL_NON_POOLED="postgresql://user:pass@host-pooler.neon.tech/db?sslmode=require"
POSTGRES_URL="postgresql://user:pass@host.neon.tech/db?sslmode=require"

# NextAuth
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="<gerar-com-openssl-rand-base64-32>"

# Google OAuth (opcional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# JWT
JWT_SECRET="<gerar-com-openssl-rand-base64-32>"
JWT_EXPIRES_IN="7d"

# Admin
ADMIN_SECRET="<secret-para-criar-admins>"
```

### Gerar Secrets

```bash
# NEXTAUTH_SECRET
openssl rand -base64 32

# JWT_SECRET  
openssl rand -base64 32

# ADMIN_SECRET
openssl rand -base64 32
```

## 🔧 3. Configurar Build

O projeto já está configurado com o `vercel.json` e scripts no `package.json`:

```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postinstall": "prisma generate"
  }
}
```

### Verificar vercel.json

```json
{
  "buildCommand": "prisma generate && prisma migrate deploy && next build",
  "installCommand": "pnpm install",
  "framework": "nextjs"
}
```

## 🗄️ 4. Migrations no Deploy

As migrations são executadas automaticamente durante o build:

```bash
prisma generate        # Gera o Prisma Client
prisma migrate deploy  # Aplica migrations pendentes
next build            # Build do Next.js
```

### Aplicar Migrations Manualmente (se necessário)

```bash
# Na raiz do projeto
pnpm prisma migrate deploy --schema=prisma/schema.prisma
```

## 🌱 5. Seed do Banco de Dados

### Opção 1: Via Script (Recomendado)

Após o primeiro deploy, rode o seed:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Rodar seed no ambiente de produção
vercel env pull .env.production
pnpm prisma db seed
```

### Opção 2: Via Neon SQL Editor

1. Acesse o SQL Editor no dashboard do Neon
2. Execute manualmente os inserts dos arquivos `data/*.json`

### Opção 3: API Endpoint

Crie uma rota protegida para seed:

```typescript
// src/app/api/seed/route.ts
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { secret } = await req.json();
  
  if (secret !== process.env.ADMIN_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Lógica de seed aqui
  
  return Response.json({ success: true });
}
```

## 👤 6. Criar Usuário Admin em Produção

### Opção 1: Script Local Conectando em Produção

```bash
# Configurar DATABASE_URL para produção temporariamente
export DATABASE_URL="postgresql://..."

# Rodar script
pnpm tsx scripts/create-admin.ts
```

### Opção 2: Via API Endpoint

```bash
curl -X POST https://your-app.vercel.app/api/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "seu-admin-secret",
    "email": "admin@example.com",
    "nome": "Admin",
    "senha": "senha-segura"
  }'
```

## ✅ 7. Verificar Deploy

Após o deploy:

1. ✅ Build passou sem erros
2. ✅ Migrations aplicadas
3. ✅ Prisma Client gerado
4. ✅ Banco de dados populado (seed)
5. ✅ Admin criado
6. ✅ Login funcionando

### Testar Endpoints

```bash
# Health check
curl https://your-app.vercel.app/api/health

# Autenticação
curl -X POST https://your-app.vercel.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","senha":"senha"}'
```

## 🔄 8. CI/CD Automático

O Vercel faz deploy automático quando você faz push:

```bash
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
```

### Deploy de Preview

Cada Pull Request gera um deploy de preview automaticamente.

### Deploy Manual

```bash
# Via CLI
vercel --prod
```

## 🐛 Troubleshooting

### Erro: "Can't reach database server"

- Verifique se as variáveis `POSTGRES_*` estão corretas
- Confirme que o projeto Neon está ativo
- Teste a conexão no SQL Editor do Neon

### Erro: "Migration failed"

```bash
# Ver logs detalhados no Vercel
vercel logs <deployment-url>

# Aplicar migration manualmente
vercel env pull
pnpm prisma migrate deploy
```

### Erro: "Module not found"

```bash
# Limpar cache do Vercel
vercel build --force

# Ou no dashboard: Settings > General > Clear Cache
```

### Deploy Lento

- Neon cold start pode demorar ~1s na primeira conexão
- Considere usar Neon com Auto-suspend desabilitado
- Ou usar Prisma Data Proxy / Accelerate

## 📊 Monitoramento

### Logs

```bash
# Ver logs em tempo real
vercel logs --follow

# Logs de uma função específica
vercel logs --follow --scope=api
```

### Analytics

- Acesse o dashboard do Vercel para métricas
- Configure Vercel Analytics para Web Vitals
- Use Vercel Speed Insights

### Database

- Monitor no dashboard do Neon
- Ative alertas de uso
- Configure backups automáticos

## 🔒 Segurança

- ✅ Use HTTPS (Vercel faz automaticamente)
- ✅ Rotacione secrets regularmente
- ✅ Configure CORS adequadamente
- ✅ Use rate limiting em APIs sensíveis
- ✅ Ative 2FA no Vercel e Neon
- ✅ Revise logs de acesso periodicamente

## 🔗 Recursos

- [Documentação Vercel](https://vercel.com/docs)
- [Documentação Neon](https://neon.tech/docs)
- [Prisma com Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
