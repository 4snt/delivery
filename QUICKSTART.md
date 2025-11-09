# ⚡ Quick Start - Delivery System

## 🚀 Início Rápido (5 minutos)

### 1. Instalação
```bash
# Clone o repositório
git clone <seu-repositorio>
cd delivery

# Instale as dependências
pnpm install

# Configure o banco de dados
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 2. Inicie o Servidor
```bash
pnpm dev
```

Acesse: http://localhost:3000

### 3. Teste a API v1
```bash
# Criar um cliente
curl -X POST http://localhost:3000/api/v1/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "senha123"
  }'

# Fazer login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "senha123"
  }'

# Listar sabores
curl http://localhost:3000/api/v1/flavors

# Criar um pedido
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "flavorIds": [1, 2],
    "additionalIds": [1],
    "size": "M",
    "totalValue": 25.50,
    "paymentMethod": "credit_card",
    "deliveryAddress": "Rua das Flores, 123"
  }'
```

---

## 📖 Entendendo a Arquitetura em 2 Minutos

### Fluxo de uma Requisição

```
HTTP Request → Controller → Use Case → Repository → Database
                    ↓            ↓           ↓
            (Adapta HTTP) (Lógica)  (Persiste)
```

### Exemplo Prático: Criar Cliente

1. **Request chega em:** `POST /api/v1/customers`
2. **Route handler** chama `CustomerController.create()`
3. **Controller** usa `makeCreateCustomerUseCase()` (Factory)
4. **Factory** injeta dependências e retorna Use Case
5. **Use Case** executa lógica:
   - Valida dados
   - Verifica duplicação (via Repository interface)
   - Hash de senha (via HashProvider interface)
   - Cria entidade Customer
   - Salva via Repository
6. **Repository** (PrismaCustomerRepository) persiste no banco
7. **Response** retorna JSON com cliente criado

---

## 🎯 Principais Comandos

### Desenvolvimento
```bash
pnpm dev              # Inicia servidor dev
pnpm build            # Build para produção
pnpm start            # Inicia servidor produção
```

### Banco de Dados
```bash
npx prisma studio     # Interface visual do banco
npx prisma generate   # Gera tipos TypeScript
npx prisma db push    # Aplica schema ao banco
npx prisma db seed    # Popula com dados iniciais
```

### Testes
```bash
pnpm test             # Executa testes
pnpm test --coverage  # Com cobertura
```

---

## 📁 Estrutura Principal

```
src/
├── core/
│   ├── domain/              # 🎯 Entidades e Interfaces
│   └── application/         # 💼 Casos de Uso
├── infrastructure/
│   ├── database/            # 💾 Repositórios Prisma
│   ├── cryptography/        # 🔐 BCrypt, JWT
│   └── http/                # 🌐 Controllers
├── composition/             # 🏗️ Factories (DI)
└── shared/                  # 🔧 Either, Errors

app/api/v1/                  # 📡 Rotas REST
```

---

## 🔥 Exemplos de Uso

### Criar Cliente
```typescript
POST /api/v1/customers
{
  "name": "Maria Santos",
  "email": "maria@email.com",
  "password": "senha123"
}
```

### Autenticar
```typescript
POST /api/v1/auth/login
{
  "email": "maria@email.com",
  "password": "senha123"
}

// Response
{
  "token": "eyJhbGciOiJIUzI1...",
  "customer": {
    "id": 1,
    "name": "Maria Santos",
    "email": "maria@email.com"
  }
}
```

### Criar Pedido
```typescript
POST /api/v1/orders
{
  "customerId": 1,
  "flavorIds": [1, 2],
  "additionalIds": [1],
  "size": "M",
  "totalValue": 25.50,
  "paymentMethod": "pix",
  "deliveryAddress": "Rua Principal, 456"
}
```

---

## 🧪 Testar Localmente

### Opção 1: cURL
```bash
# Ver todos os clientes
curl http://localhost:3000/api/v1/customers

# Ver todos os sabores
curl http://localhost:3000/api/v1/flavors

# Ver todos os adicionais
curl http://localhost:3000/api/v1/additionals
```

### Opção 2: Postman
Importe a collection do arquivo [API_GUIDE.md](./API_GUIDE.md)

### Opção 3: Interface Web
- Acesse: http://localhost:3000
- Navegue pelo fluxo de pedido

---

## 📚 Documentação Completa

| Documento | Descrição |
|-----------|-----------|
| [README.md](./README.md) | Visão geral do projeto |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Explicação detalhada da arquitetura |
| [ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md) | Diagramas visuais |
| [API_GUIDE.md](./API_GUIDE.md) | Guia completo da API |
| [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) | Migração da API antiga |
| [SUMMARY.md](./SUMMARY.md) | Sumário executivo |

---

## 🎓 Aprenda a Arquitetura

### Passo 1: Entenda as Camadas
Leia: [ARCHITECTURE.md](./ARCHITECTURE.md) - Seção "Estrutura de Camadas"

### Passo 2: Veja os Diagramas
Visualize: [ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)

### Passo 3: Siga um Fluxo Completo
1. Abra: `src/app/api/v1/customers/route.ts` (Route Handler)
2. Veja: `src/infrastructure/http/controllers/customer.controller.ts` (Controller)
3. Entenda: `src/composition/factories/customer-use-case.factory.ts` (Factory)
4. Estude: `src/core/application/use-cases/customer/create-customer.use-case.ts` (Use Case)
5. Veja: `src/core/domain/entities/customer.entity.ts` (Entity)
6. Confira: `src/infrastructure/database/prisma/repositories/prisma-customer.repository.ts` (Repository)

### Passo 4: Adicione um Novo Caso de Uso
Exemplo: Exportar clientes para CSV
1. Crie o Use Case em `application/use-cases/customer/`
2. Adicione à Factory em `composition/factories/`
3. Adicione método no Controller em `infrastructure/http/controllers/`
4. Crie a rota em `app/api/v1/customers/export/route.ts`

---

## 🔧 Configuração Avançada

### Variáveis de Ambiente
Crie `.env`:
```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gere-com-openssl-rand-base64-32"
JWT_SECRET="seu-jwt-secret"
JWT_EXPIRES_IN="7d"
```

### Trocar Banco de Dados
```bash
# PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/db"

# MySQL
DATABASE_URL="mysql://user:password@localhost:3306/db"
```

---

## 🐛 Solução de Problemas

### Erro no Prisma
```bash
rm -rf node_modules/.prisma
npx prisma generate
```

### Servidor não inicia
```bash
rm -rf .next
pnpm install
pnpm dev
```

### Banco vazio
```bash
npx prisma db push --force-reset
npx prisma db seed
```

---

## 💡 Dicas Úteis

### 1. Prisma Studio
Visualize o banco em tempo real:
```bash
npx prisma studio
```
Acesse: http://localhost:5555

### 2. VS Code Extensions Recomendadas
- **Prisma** - Syntax highlighting
- **REST Client** - Testar APIs
- **Error Lens** - Ver erros inline
- **GitLens** - Git avançado

### 3. Debugging
```typescript
// Use console.log estrategicamente
console.log('Use Case Input:', request);
console.log('Repository Result:', customer);
```

---

## 🎯 Próximos Passos

1. ✅ **Rodar o projeto** - `pnpm dev`
2. ✅ **Testar APIs** - Use Postman ou cURL
3. 📖 **Ler ARCHITECTURE.md** - Entender a estrutura
4. 🧪 **Criar testes** - Adicionar testes unitários
5. 🚀 **Adicionar features** - Implementar novos casos de uso

---

## 📞 Ajuda

- **Documentação:** Veja os 5 arquivos .md na raiz
- **Exemplos:** Todos os casos de uso têm exemplos
- **Código:** Todos os arquivos estão comentados

---

## 🎉 Parabéns!

Você agora tem um projeto seguindo:
- ✅ Clean Architecture
- ✅ DDD (Domain-Driven Design)
- ✅ Hexagonal Architecture
- ✅ SOLID Principles
- ✅ RESTful APIs

**Bom desenvolvimento! 🚀**
