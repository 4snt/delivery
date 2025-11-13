# 📚 Índice de Recursos - Delivery System

## 📄 Documentação

| Arquivo | Tamanho | Descrição | Para Quem |
|---------|---------|-----------|-----------|
| **[QUICKSTART.md](./QUICKSTART.md)** | 5 min | Guia rápido de início | 🏃 Iniciantes |
```markdown
# Índice de Recursos - Delivery System

## Documentação

| Arquivo | Tamanho | Descrição | Para Quem |
|---------|---------|-----------|-----------|
| **[QUICKSTART.md](./QUICKSTART.md)** | 5 min | Guia rápido de início | Iniciantes |
| **[README.md](./README.md)** | 15 min | Visão geral completa | Todos |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | 30 min | Arquitetura detalhada | Estudantes/Arquitetos |
| **[ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)** | 20 min | Diagramas visuais | Visuais |
| **[API_GUIDE.md](./API_GUIDE.md)** | 25 min | Guia completo da API | Desenvolvedores Frontend |
| **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** | 20 min | Migração Legacy → v1 | Time de Manutenção |
| **[SUMMARY.md](./SUMMARY.md)** | 10 min | Sumário executivo | Gestores/Apresentações |

**Total:** ~2.500 linhas de documentação

---

## Estrutura de Código

### Core (Domínio + Aplicação)

#### Domain Layer
```
src/core/domain/
├── entities/
│   ├── customer.entity.ts          # Entidade Cliente
│   ├── order.entity.ts             # Entidade Pedido
│   ├── flavor.entity.ts            # Entidade Sabor
│   └── additional.entity.ts        # Entidade Adicional
└── repositories/
    ├── customer.repository.interface.ts      # Interface Cliente
    ├── order.repository.interface.ts         # Interface Pedido
    ├── flavor.repository.interface.ts        # Interface Sabor
    ├── additional.repository.interface.ts    # Interface Adicional
    ├── hash-provider.interface.ts            # Interface Hash
    └── token-provider.interface.ts           # Interface Token
```

**Total:** 10 arquivos, ~600 linhas

#### Application Layer
```
src/core/application/use-cases/
├── customer/
│   ├── create-customer.use-case.ts
│   ├── get-customer-by-id.use-case.ts
│   ├── get-customer-by-email.use-case.ts
│   ├── list-all-customers.use-case.ts
│   ├── update-customer.use-case.ts
│   └── delete-customer.use-case.ts
├── order/
│   ├── create-order.use-case.ts
│   ├── list-all-orders.use-case.ts
│   ├── get-order-by-id.use-case.ts
│   ├── list-orders-by-customer.use-case.ts
│   └── delete-order.use-case.ts
├── flavor/
│   ├── list-all-flavors.use-case.ts
│   └── get-flavor-by-id.use-case.ts
├── additional/
│   ├── list-all-additionals.use-case.ts
│   └── get-additional-by-id.use-case.ts
└── auth/
    └── authenticate-customer.use-case.ts
```

**Total:** 18 arquivos, ~1.800 linhas

### Infrastructure (Implementações)

#### Database Repositories
```
src/infrastructure/database/prisma/repositories/
├── prisma-customer.repository.ts
├── prisma-order.repository.ts
├── prisma-flavor.repository.ts
└── prisma-additional.repository.ts
```

**Total:** 4 arquivos, ~600 linhas

#### Cryptography Providers
```
src/infrastructure/cryptography/
├── bcrypt-hash-provider.ts
└── jwt-token-provider.ts
```

**Total:** 2 arquivos, ~60 linhas

#### HTTP Controllers
```
src/infrastructure/http/controllers/
├── customer.controller.ts
├── order.controller.ts
├── flavor.controller.ts
├── additional.controller.ts
└── auth.controller.ts
```

**Total:** 5 arquivos, ~700 linhas

### Composition (Injeção de Dependências)

```
src/composition/factories/
├── customer-use-case.factory.ts
├── order-use-case.factory.ts
├── flavor-use-case.factory.ts
├── additional-use-case.factory.ts
└── auth-use-case.factory.ts
```

**Total:** 5 arquivos, ~250 linhas

### Shared (Utilitários)

```
src/shared/
├── either/
│   └── either.ts                    # Either<L, R> pattern
└── errors/
    └── app-error.ts                 # Hierarquia de erros
```

**Total:** 2 arquivos, ~100 linhas

### API Routes (Next.js)

```
src/app/api/v1/
├── customers/
│   ├── route.ts                     # GET, POST, PUT
│   └── [id]/
│       └── route.ts                 # GET, DELETE
├── orders/
│   ├── route.ts                     # GET, POST
│   └── [id]/
│       └── route.ts                 # GET, DELETE
├── flavors/
│   ├── route.ts                     # GET
│   └── [id]/
│       └── route.ts                 # GET
├── additionals/
│   ├── route.ts                     # GET
│   └── [id]/
│       └── route.ts                 # GET
└── auth/
    └── login/
        └── route.ts                 # POST
```

**Total:** 9 arquivos, ~400 linhas

---

## Estatísticas do Projeto

### Arquivos Criados
- **Domain Layer:** 10 arquivos
- **Application Layer:** 18 arquivos
- **Infrastructure Layer:** 11 arquivos
- **Composition Layer:** 5 arquivos
- **Shared Layer:** 2 arquivos
- **API Routes:** 9 arquivos
- **Documentação:** 7 arquivos

**Total:** 62 arquivos novos

### Linhas de Código
- **Core (Domain + Application):** ~2.400 linhas
- **Infrastructure:** ~1.360 linhas
- **Composition:** ~250 linhas
- **Shared:** ~100 linhas
- **API Routes:** ~400 linhas
- **Documentação:** ~2.500 linhas

**Total:** ~7.000 linhas (código + documentação)

### Casos de Uso Implementados
- **Customer:** 6 casos de uso
- **Order:** 5 casos de uso
- **Flavor:** 2 casos de uso
- **Additional:** 2 casos de uso
- **Auth:** 1 caso de uso

**Total:** 18 casos de uso

### Endpoints API
- **Customers:** 6 endpoints
- **Orders:** 5 endpoints
- **Flavors:** 2 endpoints
- **Additionals:** 2 endpoints
- **Auth:** 1 endpoint
- **Legacy:** ~20 endpoints (depreciados)

**Total:** 17 endpoints (v1) + 20 (legacy)

---

## Padrões Implementados

### Design Patterns
- Repository Pattern
- Use Case Pattern
- Factory Pattern
- Adapter Pattern
- Entity Pattern
- Either Pattern (Functional)

### Architectural Patterns
- Clean Architecture
- Hexagonal Architecture (Ports & Adapters)
- Domain-Driven Design (DDD)
- Layered Architecture
- Dependency Inversion

### SOLID Principles
- Single Responsibility
- Open/Closed
- Liskov Substitution
- Interface Segregation
- Dependency Inversion

---

## API Endpoints Completa

### Customers (6 endpoints)
```
GET    /api/v1/customers              # Listar todos
GET    /api/v1/customers?email={email}# Buscar por email
GET    /api/v1/customers/{id}         # Buscar por ID
POST   /api/v1/customers              # Criar
PUT    /api/v1/customers              # Atualizar
DELETE /api/v1/customers/{id}         # Deletar
```

### Orders (5 endpoints)
```
GET    /api/v1/orders                 # Listar todos
GET    /api/v1/orders?customerId={id} # Listar por cliente
GET    /api/v1/orders/{id}            # Buscar por ID
POST   /api/v1/orders                 # Criar
DELETE /api/v1/orders/{id}            # Deletar
```

### Flavors (2 endpoints)
```
GET    /api/v1/flavors                # Listar todos
GET    /api/v1/flavors/{id}           # Buscar por ID
```

### Additionals (2 endpoints)
```
GET    /api/v1/additionals            # Listar todos
GET    /api/v1/additionals/{id}       # Buscar por ID
```

### Auth (1 endpoint)
```
POST   /api/v1/auth/login             # Autenticar
```

---

## Testes

### Estrutura de Testes (Planejado)
```
tests/
├── unit/
│   ├── use-cases/
│   │   ├── customer/
│   │   ├── order/
│   │   ├── flavor/
│   │   └── additional/
│   └── entities/
├── integration/
│   └── repositories/
└── e2e/
    └── api/
```

### Cobertura Planejada
- **Unit Tests:** Use Cases e Entities
- **Integration Tests:** Repositories
- **E2E Tests:** API Routes

---

## Dependências

### Produção
```json
{
  "@prisma/client": "6.19.0",
  "bcryptjs": "^3.0.2",
  "jsonwebtoken": "^9.0.2",
  "next": "15.5.3",
  "next-auth": "^4.24.11",
  "react": "19.1.0",
  "react-dom": "19.1.0"
}
```

### Desenvolvimento
```json
{
  "@types/bcryptjs": "^3.0.0",
  "@types/jsonwebtoken": "^9.0.10",
  "@types/jest": "^30.0.0",
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "prisma": "^6.19.0",
  "typescript": "^5",
  "tailwindcss": "^4"
}
```

---

## Recursos para Aprendizado

### Livros Seguidos
1. **Clean Architecture** - Robert C. Martin (Uncle Bob)
2. **Domain-Driven Design** - Eric Evans
3. **Implementing Domain-Driven Design** - Vaughn Vernon

### Artigos Online
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Clean Architecture Blog](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

### Tutoriais no Projeto
- Ver `ARCHITECTURE.md` - Seção "Exemplo Prático"
- Ver `ARCHITECTURE_DIAGRAM.md` - Seção "Fluxo Completo"
- Ver `API_GUIDE.md` - Todos os endpoints com exemplos

---

## Comandos Úteis

### Desenvolvimento
```bash
pnpm dev              # Inicia servidor desenvolvimento
pnpm build            # Build para produção
pnpm start            # Inicia servidor produção
pnpm test             # Executa testes
```

### Banco de Dados
```bash
npx prisma studio     # Interface visual
npx prisma generate   # Gera tipos
npx prisma db push    # Aplica schema
npx prisma db seed    # Popula dados
```

### Limpeza
```bash
rm -rf .next          # Limpa build Next.js
rm -rf node_modules   # Remove dependências
npx prisma migrate reset  # Reseta banco
```

---

## Guia de Leitura Recomendado

### Para Iniciantes
1. **[QUICKSTART.md](./QUICKSTART.md)** (5 min)
2. **[README.md](./README.md)** - Seção "Arquitetura" (10 min)
3. **[ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)** (15 min)
4. **[API_GUIDE.md](./API_GUIDE.md)** - Exemplos básicos (10 min)

**Total:** ~40 minutos

### Para Estudantes/Acadêmicos
1. **[ARCHITECTURE.md](./ARCHITECTURE.md)** completo (30 min)
2. **[ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)** (20 min)
3. **[SUMMARY.md](./SUMMARY.md)** (10 min)
4. Estudar código de 2-3 Use Cases (30 min)

**Total:** ~90 minutos

### Para Desenvolvedores Profissionais
1. **[README.md](./README.md)** - Visão geral (5 min)
2. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Foco em padrões (15 min)
3. **[API_GUIDE.md](./API_GUIDE.md)** - Todos os endpoints (15 min)
4. **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** (15 min)
5. Análise de código completa (60 min)

**Total:** ~2 horas

---

## Checklist de Uso

### Primeiro Uso
- [ ] Ler QUICKSTART.md
- [ ] Instalar dependências
- [ ] Rodar banco de dados
- [ ] Testar API com cURL/Postman
- [ ] Explorar interface web

### Entendimento
- [ ] Ler ARCHITECTURE.md
- [ ] Ver diagramas
- [ ] Seguir fluxo de um Use Case
- [ ] Entender inversão de dependências
- [ ] Compreender benefícios

### Desenvolvimento
- [ ] Adicionar novo Use Case
- [ ] Criar testes unitários
- [ ] Implementar nova feature
- [ ] Documentar mudanças

---

## Uso Profissional

### Para Apresentações
- Use **SUMMARY.md** como base
- Mostre **ARCHITECTURE_DIAGRAM.md** em slides
- Demo ao vivo com **QUICKSTART.md**
- Explique benefícios com **ARCHITECTURE.md**

### Para Portfolio
- Link para repositório GitHub
- Destaque arquitetura no README
- Adicione screenshots da API
- Mencione padrões implementados

### Para Entrevistas
- Explique fluxo completo de requisição
- Demonstre conhecimento de SOLID
- Mostre independência de frameworks
- Discuta decisões arquiteturais

---

## Suporte

### Documentação
- Todos os arquivos .md na raiz do projeto
- Comentários inline no código
- Exemplos em cada Use Case

### Comunidade
- Crie issues no GitHub
- Contribua com PRs
- Compartilhe melhorias

---

## Parabéns!

Você tem acesso a:
- 62 arquivos de código limpo
- 7 documentos completos
- 18 casos de uso
- 17 endpoints RESTful
- Arquitetura enterprise
- Padrões SOLID
- 100% TypeScript

**Explore, aprenda e evolua!**

---

**Última atualização:** 09/11/2025

````
