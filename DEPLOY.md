# 🚀 Guia de Deploy - Ambiente de Homologação

## 📋 Pré-requisitos

- Node.js 20+ instalado
- pnpm instalado (`npm install -g pnpm`)
- Servidor com acesso SSH
- Domínio ou IP do servidor

## 🔧 Preparação do Ambiente

### 1. Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Configure as variáveis para homologação:

```env
# Database (usar PostgreSQL em produção)
DATABASE_URL="file:./homolog.db"

# NextAuth.js
NEXTAUTH_URL=https://seu-dominio-homolog.com
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# JWT Secret
JWT_SECRET=$(openssl rand -base64 32)

# Environment
NODE_ENV=production
```

### 2. Configurar Banco de Dados

**Para Homologação (SQLite):**
```bash
# Gerar Prisma Client
pnpm db:generate

# Aplicar migrations
pnpm db:push

# Popular com dados iniciais
pnpm db:seed

# Criar usuário admin
pnpm create-admin
```

**Para Produção (recomendado PostgreSQL):**

Atualizar `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // ao invés de sqlite
  url      = env("DATABASE_URL")
}
```

`.env`:
```env
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
```

## 📦 Build da Aplicação

```bash
# Instalar dependências
pnpm install --frozen-lockfile

# Build de produção
pnpm build
```

## 🚀 Deploy Manual (Servidor Linux)

### 1. Preparar Servidor

```bash
# Conectar no servidor
ssh user@seu-servidor.com

# Instalar Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar pnpm
npm install -g pnpm

# Instalar PM2 (gerenciador de processos)
npm install -g pm2
```

### 2. Clonar Repositório

```bash
# Clonar do GitHub
git clone https://github.com/4snt/delivery.git
cd delivery

# Instalar dependências
pnpm install --frozen-lockfile

# Copiar .env.example e configurar
cp .env.example .env
nano .env  # Editar com valores corretos
```

### 3. Configurar Banco de Dados

```bash
# Gerar Prisma Client
pnpm db:generate

# Aplicar schema
pnpm db:push

# Popular dados
pnpm db:seed

# Criar admin
pnpm create-admin
```

### 4. Build e Iniciar

```bash
# Build
pnpm build

# Iniciar com PM2
pm2 start "pnpm start" --name delivery-homolog
pm2 save
pm2 startup  # Configurar para iniciar no boot
```

### 5. Configurar Nginx (Proxy Reverso)

```nginx
# /etc/nginx/sites-available/delivery-homolog
server {
    listen 80;
    server_name seu-dominio-homolog.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Habilitar site
sudo ln -s /etc/nginx/sites-available/delivery-homolog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. SSL com Let's Encrypt (Opcional)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio-homolog.com
```

## 🔄 Atualização (CI/CD Manual)

```bash
# No servidor
cd /path/to/delivery

# Pull das mudanças
git pull origin main

# Reinstalar dependências (se necessário)
pnpm install --frozen-lockfile

# Rebuild
pnpm build

# Reiniciar aplicação
pm2 restart delivery-homolog
```

## 🐳 Deploy com Docker (Alternativa)

### 1. Criar Dockerfile

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm prisma generate
RUN pnpm build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["npm", "start"]
```

### 2. Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=file:./homolog.db
      - NEXTAUTH_URL=https://seu-dominio-homolog.com
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
    volumes:
      - ./prisma:/app/prisma
    restart: unless-stopped
```

### 3. Deploy

```bash
docker-compose up -d
```

## ☁️ Deploy na Vercel (Recomendado)

### 1. Preparar para Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login
```

### 2. Configurar

Criar `vercel.json`:
```json
{
  "buildCommand": "pnpm prisma generate && pnpm build",
  "installCommand": "pnpm install --frozen-lockfile"
}
```

### 3. Deploy

```bash
# Deploy de homologação
vercel

# Deploy de produção
vercel --prod
```

### 4. Configurar Variáveis de Ambiente

No dashboard da Vercel:
1. Acesse Project Settings → Environment Variables
2. Adicione:
   - `DATABASE_URL` (use PostgreSQL na Vercel)
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `JWT_SECRET`

**⚠️ Importante:** Vercel requer PostgreSQL ou outro DB online (não SQLite)

## 📊 Usar PostgreSQL (Recomendado para Homolog/Prod)

### Opção 1: Supabase (Gratuito)

1. Criar conta em https://supabase.com
2. Criar novo projeto
3. Copiar connection string
4. Atualizar `.env`:
```env
DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"
```

### Opção 2: Railway.app (Gratuito)

1. Criar conta em https://railway.app
2. New Project → PostgreSQL
3. Copiar DATABASE_URL
4. Atualizar `.env`

### Migração SQLite → PostgreSQL

```bash
# Atualizar schema.prisma
# Gerar nova migration
pnpm prisma migrate dev --name migrate_to_postgres

# Aplicar
pnpm prisma migrate deploy
```

## ✅ Checklist de Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados configurado
- [ ] Prisma Client gerado
- [ ] Migrations aplicadas
- [ ] Dados iniciais populados
- [ ] Usuário admin criado
- [ ] Build executado com sucesso
- [ ] SSL configurado (HTTPS)
- [ ] Domínio apontando corretamente
- [ ] PM2/Docker configurado
- [ ] Nginx configurado (se aplicável)
- [ ] Backups configurados

## 🔒 Segurança

1. **Secrets Fortes:**
```bash
# Gerar secrets seguros
openssl rand -base64 32
```

2. **Firewall:**
```bash
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
sudo ufw enable
```

3. **Updates Automáticos:**
```bash
sudo apt-get install unattended-upgrades
```

## 📝 Logs

```bash
# PM2 logs
pm2 logs delivery-homolog

# Logs específicos
pm2 logs delivery-homolog --lines 100
pm2 logs delivery-homolog --err  # Apenas erros
```

## 🆘 Troubleshooting

### Erro: Prisma Client não gerado
```bash
pnpm prisma generate
```

### Erro: Database connection
```bash
# Verificar DATABASE_URL no .env
# Testar conexão
pnpm prisma db push
```

### Erro: Build falhou
```bash
# Limpar cache
rm -rf .next
pnpm build
```

---

**Pronto para deploy! 🚀**
