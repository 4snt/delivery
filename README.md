# 🍦 Delivery App - Sistema de Pedidos

Sistema de delivery desenvolvido com **Next.js 15**, **Prisma ORM**, **PostgreSQL** e **TypeScript**, seguindo princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**.

## 🚀 Quick Start

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/delivery.git
cd delivery

# 2. Instale as dependências
pnpm install

# 3. Inicie o PostgreSQL com Docker
docker-compose up -d

# 4. Configure as variáveis de ambiente
cp .env.local.example .env.local

# 5. Configure o banco de dados
pnpm prisma generate
pnpm prisma migrate deploy
pnpm prisma db seed

# 6. Crie um usuário admin
pnpm tsx scripts/create-admin.ts

# 7. Inicie o servidor
pnpm dev
```

Acesse: **http://localhost:3000**

## 📚 Documentação Completa

Toda a documentação está organizada na pasta `/docs`:

- **[🚀 Setup Local Completo](./docs/LOCAL_DEVELOPMENT.md)** - Guia detalhado de desenvolvimento local
- **[🌐 Deploy no Vercel](./docs/DEPLOYMENT.md)** - Deploy em produção com Neon PostgreSQL
- **[🏗️ Arquitetura](./docs/ARCHITECTURE.md)** - Clean Architecture, DDD e padrões de design
- **[📖 Índice Completo](./docs/INDEX.md)** - Todos os documentos disponíveis

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Clean Architecture
- **Database**: PostgreSQL (prod), Docker para local
- **ORM**: Prisma
- **Auth**: NextAuth.js (Google OAuth + Credentials)
- **Deployment**: Vercel + Neon PostgreSQL

## 📁 Estrutura do Projeto

```
delivery/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # React Components
│   ├── core/               # Domain Layer (DDD)
│   ├── infrastructure/     # Infrastructure Layer
│   └── lib/                # Utilities
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── seed.ts             # Seed script
│   └── migrations/         # Database migrations
├── docs/                   # 📚 Documentação completa
├── docker-compose.yml      # PostgreSQL local
└── README.md              # Este arquivo
```

## 🐳 Docker (PostgreSQL Local)

```bash
# Iniciar PostgreSQL
docker-compose up -d

# Parar PostgreSQL
docker-compose down

# Ver logs
docker-compose logs -f postgres

# Acessar o banco via CLI
docker exec -it delivery-postgres psql -U delivery -d delivery_db
```

**Credenciais padrão**:
- **Host**: localhost:5432
- **Database**: delivery_db
- **User**: delivery
- **Password**: delivery123

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
pnpm dev                    # Inicia servidor de desenvolvimento
pnpm build                  # Build de produção
pnpm start                  # Servidor de produção
pnpm lint                   # Linting

# Prisma
pnpm prisma studio          # UI visual do banco
pnpm prisma migrate dev     # Criar nova migration
pnpm prisma migrate deploy  # Aplicar migrations
pnpm prisma db seed         # Popular banco com dados iniciais
pnpm prisma generate        # Gerar Prisma Client

# Docker
docker-compose up -d        # Inicia PostgreSQL
docker-compose down         # Para PostgreSQL
docker-compose ps           # Status dos containers
```

## 🗄️ Database Schema

```
Cliente (Customer)
├── id: BigInt
├── email: String (unique)
├── nome: String
├── senha: String (hashed)
├── isAdmin: Boolean
└── pedidos: Pedido[]

Pedido (Order)
├── id: BigInt
├── cliente: Cliente
├── sabores: Sabor[] (many-to-many)
├── adicionais: Adicional[] (many-to-many)
├── tamanho: String
├── valorTotal: Float
├── formaPagamento: String
├── enderecoEntrega: String
├── status: String
└── createdAt: DateTime

Sabor (Flavor)
├── id: BigInt
├── nome: String
└── imagem: String

Adicional (Additional)
├── id: BigInt
└── nome: String
```

## 🔐 Autenticação

O sistema suporta dois métodos de autenticação:

1. **NextAuth** (Recomendado)
   - Google OAuth
   - Email + Senha
   - Session management

2. **JWT Legacy**
   - Token-based authentication
   - Usado em APIs legacy

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório no Vercel
2. Configure a integração com Neon PostgreSQL
3. As variáveis de ambiente serão configuradas automaticamente
4. Deploy! 🎉

**[📖 Guia completo de deploy →](./docs/DEPLOYMENT.md)**

## 🏗️ Arquitetura

O projeto segue **Clean Architecture** com camadas bem definidas:

```
┌─────────────────────────────────┐
│   Presentation Layer (UI/API)  │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│   Application Layer (Use Cases)│
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│      Domain Layer (Entities)    │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│  Infrastructure Layer (Prisma)  │
└─────────────────────────────────┘
```

**[📖 Arquitetura detalhada →](./docs/ARCHITECTURE.md)**

## 📝 Variáveis de Ambiente

### Local Development

```env
# PostgreSQL (Docker)
POSTGRES_PRISMA_URL="postgresql://delivery:delivery123@localhost:5432/delivery_db"
POSTGRES_URL_NON_POOLED="postgresql://delivery:delivery123@localhost:5432/delivery_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<generate-with-openssl-rand-base64-32>"

# JWT
JWT_SECRET="<generate-with-openssl-rand-base64-32>"
JWT_EXPIRES_IN="7d"

# Admin
ADMIN_SECRET="<your-admin-secret>"
```

### Production (Vercel + Neon)

As variáveis são configuradas automaticamente pela integração Neon → Vercel.

**[📖 Guia de configuração →](./docs/DEPLOYMENT.md#variáveis-de-ambiente)**

## 🧪 Testes

```bash
# Executar testes
pnpm test

# Com coverage
pnpm test:coverage

# Watch mode
pnpm test:watch
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Convenção de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Manutenção

## 📄 Licença

Este projeto está sob a licença MIT.

## 🆘 Precisa de Ajuda?

- **[💬 Troubleshooting](./docs/LOCAL_DEVELOPMENT.md#troubleshooting)**
- **[📧 Issues](https://github.com/seu-usuario/delivery/issues)**
- **[📚 Documentação Completa](./docs/INDEX.md)**

---

**Desenvolvido com 💜 usando Next.js, Prisma e Clean Architecture**
