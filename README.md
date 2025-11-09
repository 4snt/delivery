# 🍦 Sorveteria Delivery

Sistema de delivery de sorvetes artesanais desenvolvido com Next.js 15, Prisma ORM e SQLite.

## 🚀 Tecnologias

- **Next.js 15.5.3** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Prisma ORM** - Gerenciamento de banco de dados
- **SQLite** - Banco de dados relacional
- **NextAuth.js** - Autenticação (Google OAuth + Credentials)
- **Tailwind CSS 4** - Estilização
- **bcryptjs** - Hash de senhas
- **JWT** - Tokens de autenticação

## 📦 Instalação

```bash
# Instalar dependências
pnpm install

# Configurar banco de dados
npx prisma generate
npx prisma db push
npx prisma db seed

# Iniciar servidor de desenvolvimento
pnpm dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## 🗄️ Banco de Dados

### Estrutura (Schema Prisma)

```prisma
// Cliente
model Cliente {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  nome      String
  senha     String   // Hash bcrypt
  pedidos   Pedido[]
}

// Sabor
model Sabor {
  id      Int             @id @default(autoincrement())
  nome    String
  imagem  String
  pedidos PedidoSabor[]
}

// Adicional
model Adicional {
  id      Int                @id @default(autoincrement())
  nome    String
  pedidos PedidoAdicional[]
}

// Pedido
model Pedido {
  id                Int                @id @default(autoincrement())
  cliente           Cliente            @relation(fields: [clienteId], references: [id])
  clienteId         Int
  sabores           PedidoSabor[]
  adicionais        PedidoAdicional[]
  tamanho           String
  valorTotal        Float
  formaPagamento    String
  enderecoEntrega   String
  createdAt         DateTime           @default(now())
}

// Tabelas de junção (Many-to-Many)
model PedidoSabor {
  pedido    Pedido @relation(fields: [pedidoId], references: [id], onDelete: Cascade)
  pedidoId  Int
  sabor     Sabor  @relation(fields: [saborId], references: [id], onDelete: Cascade)
  saborId   Int
  @@id([pedidoId, saborId])
}

model PedidoAdicional {
  pedido       Pedido    @relation(fields: [pedidoId], references: [id], onDelete: Cascade)
  pedidoId     Int
  adicional    Adicional @relation(fields: [adicionalId], references: [id], onDelete: Cascade)
  adicionalId  Int
  @@id([pedidoId, adicionalId])
}
```

### Relacionamentos

- **Cliente** → **Pedido**: Um para Muitos (1:N)
- **Pedido** → **Sabor**: Muitos para Muitos (N:M) via `PedidoSabor`
- **Pedido** → **Adicional**: Muitos para Muitos (N:M) via `PedidoAdicional`

## 🔌 API REST

### Base URL
```
http://localhost:3000/api
```

---

### 👤 Clientes

#### **GET** `/api/clientes`
Listar todos os clientes ou buscar por email

**Query Params:**
- `email` (opcional): Filtrar por email específico

**Resposta de Sucesso (200):**
```json
[
  {
    "id": 1,
    "email": "cliente@email.com",
    "nome": "João Silva"
  }
]
```

**Nota:** Senhas nunca são retornadas nas respostas

---

#### **POST** `/api/clientes`
Criar novo cliente

**Body:**
```json
{
  "nome": "Maria Santos",
  "email": "maria@email.com",
  "senha": "senha123"
}
```

**Validações:**
- Nome, email e senha são obrigatórios
- Email deve ser único
- Senha é armazenada com hash bcrypt

**Resposta de Sucesso (201):**
```json
{
  "id": 2,
  "email": "maria@email.com",
  "nome": "Maria Santos"
}
```

**Erros:**
- `400`: Campos obrigatórios faltando
- `409`: Email já cadastrado
- `500`: Erro no servidor

---

#### **PUT** `/api/clientes`
Atualizar cliente existente

**Body:**
```json
{
  "email": "maria@email.com",
  "nome": "Maria Santos Silva",
  "senha": "novaSenha123"
}
```

**Validações:**
- Email é obrigatório (identificador)
- Nome e senha são opcionais
- Cliente deve existir

**Resposta de Sucesso (200):**
```json
{
  "id": 2,
  "email": "maria@email.com",
  "nome": "Maria Santos Silva"
}
```

**Erros:**
- `400`: Email não fornecido
- `404`: Cliente não encontrado
- `500`: Erro no servidor

---

#### **DELETE** `/api/clientes?id={id}`
Remover cliente

**Query Params:**
- `id`: ID do cliente (obrigatório)

**Resposta de Sucesso (200):**
```json
{
  "message": "Cliente removido com sucesso"
}
```

**Erros:**
- `400`: ID não fornecido
- `404`: Cliente não encontrado
- `500`: Erro no servidor

---

### 🍨 Sabores

#### **GET** `/api/sabores`
Listar todos os sabores disponíveis

**Resposta de Sucesso (200):**
```json
[
  {
    "id": 1,
    "nome": "Chocolate",
    "imagem": "/images/chocolate.jpg"
  },
  {
    "id": 2,
    "nome": "Morango",
    "imagem": "/images/morango.jpg"
  }
]
```

---

#### **POST** `/api/sabores`
Criar novo sabor

**Body:**
```json
{
  "nome": "Açaí",
  "imagem": "/images/acai.jpg"
}
```

**Resposta de Sucesso (201):**
```json
{
  "id": 3,
  "nome": "Açaí",
  "imagem": "/images/acai.jpg"
}
```

---

#### **DELETE** `/api/sabores?id={id}`
Remover sabor

**Query Params:**
- `id`: ID do sabor (obrigatório)

**Resposta de Sucesso (200):**
```json
{
  "message": "Sabor removido com sucesso"
}
```

---

### ✨ Adicionais

#### **GET** `/api/adicionais`
Listar todos os adicionais disponíveis

**Resposta de Sucesso (200):**
```json
[
  {
    "id": 1,
    "nome": "Granulado"
  },
  {
    "id": 2,
    "nome": "Calda de Chocolate"
  }
]
```

---

#### **POST** `/api/adicionais`
Criar novo adicional

**Body:**
```json
{
  "nome": "Chantilly"
}
```

**Resposta de Sucesso (201):**
```json
{
  "id": 3,
  "nome": "Chantilly"
}
```

---

#### **DELETE** `/api/adicionais?id={id}`
Remover adicional

**Query Params:**
- `id`: ID do adicional (obrigatório)

**Resposta de Sucesso (200):**
```json
{
  "message": "Adicional removido com sucesso"
}
```

---

### 📦 Pedidos

#### **GET** `/api/pedidos`
Listar todos os pedidos com relacionamentos

**Resposta de Sucesso (200):**
```json
[
  {
    "id": 1,
    "clienteId": 1,
    "tamanho": "Grande",
    "valorTotal": 35.5,
    "formaPagamento": "Cartão de Crédito",
    "enderecoEntrega": "Rua Teste, 123",
    "createdAt": "2025-11-09T13:22:16.340Z",
    "cliente": {
      "id": 1,
      "email": "joao@test.com",
      "nome": "João Silva"
    },
    "sabores": [
      {
        "pedidoId": 1,
        "saborId": 4,
        "sabor": {
          "id": 4,
          "nome": "Sorvete de Ninho",
          "imagem": "/images/ninho.png"
        }
      }
    ],
    "adicionais": [
      {
        "pedidoId": 1,
        "adicionalId": 11,
        "adicional": {
          "id": 11,
          "nome": "Granulado"
        }
      }
    ]
  }
]
```

---

#### **POST** `/api/pedidos`
Criar novo pedido

**Body:**
```json
{
  "clienteId": 1,
  "sabores": [
    { "id": 4 },
    { "id": 5 }
  ],
  "adicionais": [
    { "id": 11 },
    { "id": 12 }
  ],
  "tamanho": "Grande",
  "valorTotal": 35.50,
  "formaPagamento": "Pix",
  "enderecoEntrega": "Rua Principal, 456"
}
```

**Resposta de Sucesso (201):**
```json
{
  "id": 2,
  "clienteId": 1,
  "tamanho": "Grande",
  "valorTotal": 35.5,
  "formaPagamento": "Pix",
  "enderecoEntrega": "Rua Principal, 456",
  "createdAt": "2025-11-09T13:23:43.132Z",
  "cliente": { ... },
  "sabores": [ ... ],
  "adicionais": [ ... ]
}
```

---

#### **PUT** `/api/pedidos`
Atualizar pedido existente

**Body:**
```json
{
  "id": 2,
  "formaPagamento": "Cartão de Débito"
}
```

**Resposta de Sucesso (200):**
```json
{
  "id": 2,
  "formaPagamento": "Cartão de Débito",
  ...
}
```

---

#### **DELETE** `/api/pedidos?id={id}`
Remover pedido

**Query Params:**
- `id`: ID do pedido (obrigatório)

**Resposta de Sucesso (200):**
```json
{
  "message": "Pedido removido com sucesso"
}
```

---

### 🔐 Autenticação

#### **POST** `/api/jwt/login`
Gerar token JWT para cliente

**Body:**
```json
{
  "email": "cliente@email.com",
  "nome": "João Silva"
}
```

**Resposta de Sucesso (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Validações:**
- Email é obrigatório
- Token expira em 7 dias (padrão)

---

#### **NextAuth Routes**

##### **POST/GET** `/api/auth/[...nextauth]`
Rotas de autenticação do NextAuth

**Providers Configurados:**
1. **Google OAuth**
2. **Credentials (Email/Senha)**

**Endpoints:**
- `/api/auth/signin` - Página de login
- `/api/auth/signout` - Logout
- `/api/auth/session` - Obter sessão atual
- `/api/auth/callback/google` - Callback do Google

**Exemplo de Login com Credentials:**
```typescript
import { signIn } from "next-auth/react";

const result = await signIn("credentials", {
  redirect: false,
  email: "usuario@email.com",
  senha: "senha123"
});
```

**Exemplo de Login com Google:**
```typescript
import { signIn } from "next-auth/react";

await signIn("google", { callbackUrl: "/" });
```

---

## 🎨 Interface (UI)

### Páginas Principais

- **`/`** - Homepage com apresentação
- **`/login`** - Login principal (NextAuth)
- **`/ui/cliente/cadastro`** - Cadastro de novo cliente
- **`/ui/cliente/login`** - Login alternativo de cliente

### Fluxo de Pedido

1. **`/ui/pedido/tamanho`** - Seleção do tamanho do pote
2. **`/ui/pedido/sabores`** - Escolha dos sabores
3. **`/ui/pedido/adicionais`** - Adicionais opcionais
4. **`/ui/pedido/carrinho`** - Revisão do pedido
5. **`/ui/pedido/login`** - Login/Cadastro para finalizar
6. **`/ui/pedido/pagamento`** - Forma de pagamento
7. **`/ui/pedido/endereco`** - Endereço de entrega

### Área Protegida

- **`/protegido/dashboard`** - Dashboard do usuário logado

---

## 🔒 Segurança

### Senhas
- Todas as senhas são hashadas com **bcrypt** (salt rounds: 10)
- Senhas **nunca** são retornadas nas respostas da API
- Mínimo de 6 caracteres exigido no frontend

### Autenticação
- **NextAuth.js** para gerenciamento de sessões
- Estratégia: **JWT** (JSON Web Tokens)
- Suporte a Google OAuth e Credentials
- Tokens de sessão seguros e HTTP-only

### Validações
- Verificação de duplicação de email no cadastro
- Validação de campos obrigatórios
- Tratamento de erros consistente
- Status codes HTTP apropriados

---

## 📝 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-secret-aqui-gere-com-openssl-rand-base64-32"

# Google OAuth (opcional)
GOOGLE_CLIENT_ID="seu-google-client-id"
GOOGLE_CLIENT_SECRET="seu-google-client-secret"

# JWT
JWT_SECRET="seu-jwt-secret-aqui"
JWT_EXPIRES_IN="7d"
```

---

## 🧪 Testes

```bash
# Executar testes de integração
npm test

# Com coverage
npm test -- --coverage
```

---

## 📊 Status do Projeto

### ✅ Funcionalidades Implementadas

- [x] Sistema de autenticação completo (Google + Email/Senha)
- [x] CRUD de Clientes
- [x] CRUD de Sabores
- [x] CRUD de Adicionais
- [x] CRUD de Pedidos
- [x] Relacionamentos Many-to-Many otimizados para SQLite
- [x] Interface responsiva e moderna
- [x] Fluxo completo de pedido
- [x] Validações e tratamento de erros
- [x] Hash de senhas com bcrypt
- [x] Tokens JWT

### 🚧 Próximas Features

- [ ] Painel administrativo
- [ ] Histórico de pedidos do cliente
- [ ] Sistema de notificações
- [ ] Integração com gateway de pagamento
- [ ] Rastreamento de pedidos em tempo real
- [ ] Sistema de avaliações

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 👨‍💻 Desenvolvimento

```bash
# Resetar banco de dados
npx prisma db push --force-reset

# Repovoar banco de dados
npx prisma db seed

# Visualizar banco de dados
npx prisma studio

# Gerar tipos do Prisma
npx prisma generate
```

---

## 🐛 Solução de Problemas

### Erro de migração do Prisma
```bash
npx prisma migrate reset
npx prisma generate
npx prisma db seed
```

### Erro de tipos TypeScript
```bash
rm -rf node_modules/.prisma
npx prisma generate
```

### Servidor não inicia
```bash
# Limpar cache
rm -rf .next
pnpm install
pnpm dev
```

---

**Desenvolvido com 💜 usando Next.js e Prisma**
