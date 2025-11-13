# 🔄 Guia de Migração - API Legacy → API v1

## 📋 Visão Geral

Este guia ajuda na migração das rotas antigas (`/api/*`) para as novas rotas RESTful (`/api/v1/*`) que seguem Clean Architecture.

## 🔀 Mapeamento de Rotas

### Clientes (Customers)

| Antiga (Legacy) | Nova (v1) | Método | Mudanças |
|----------------|-----------|--------|----------|
| `GET /api/clientes` | `GET /api/v1/customers` | GET | Nome em inglês |
| `GET /api/clientes?email={email}` | `GET /api/v1/customers?email={email}` | GET | Mesma estrutura |
| `POST /api/clientes` | `POST /api/v1/customers` | POST | Mesma estrutura |
| `PUT /api/clientes` | `PUT /api/v1/customers` | PUT | Mesma estrutura |
| `DELETE /api/clientes?id={id}` | `DELETE /api/v1/customers/{id}` | DELETE | ID na rota |

### Autenticação (Authentication)

| Antiga (Legacy) | Nova (v1) | Método | Mudanças |
|----------------|-----------|--------|----------|
| `POST /api/jwt/login` | `POST /api/v1/auth/login` | POST | Rota simplificada |

### Pedidos (Orders)

| Antiga (Legacy) | Nova (v1) | Método | Mudanças |
|----------------|-----------|--------|----------|
| `GET /api/pedidos` | `GET /api/v1/orders` | GET | Nome em inglês |
| `POST /api/pedidos` | `POST /api/v1/orders` | POST | Nome em inglês |
| `PUT /api/pedidos` | `PUT /api/v1/orders` | PUT | **Removido** |
| `DELETE /api/pedidos?id={id}` | `DELETE /api/v1/orders/{id}` | DELETE | ID na rota |
| N/A | `GET /api/v1/orders?customerId={id}` | GET | **Nova funcionalidade** |
| N/A | `GET /api/v1/orders/{id}` | GET | **Nova funcionalidade** |

### Sabores (Flavors)

| Antiga (Legacy) | Nova (v1) | Método | Mudanças |
|----------------|-----------|--------|----------|
| `GET /api/sabores` | `GET /api/v1/flavors` | GET | Nome em inglês |
| `POST /api/sabores` | N/A | POST | Removido da API pública |
| `DELETE /api/sabores?id={id}` | N/A | DELETE | Removido da API pública |
```markdown
# Guia de Migração - API Legacy → API v1

## Visão Geral

Este guia ajuda na migração das rotas antigas (`/api/*`) para as novas rotas RESTful (`/api/v1/*`) que seguem Clean Architecture.

## Mapeamento de Rotas

### Clientes (Customers)

| Antiga (Legacy) | Nova (v1) | Método | Mudanças |
|----------------|-----------|--------|----------|
| `GET /api/clientes` | `GET /api/v1/customers` | GET | Nome em inglês |
| `GET /api/clientes?email={email}` | `GET /api/v1/customers?email={email}` | GET | Mesma estrutura |
| `POST /api/clientes` | `POST /api/v1/customers` | POST | Mesma estrutura |
| `PUT /api/clientes` | `PUT /api/v1/customers` | PUT | Mesma estrutura |
| `DELETE /api/clientes?id={id}` | `DELETE /api/v1/customers/{id}` | DELETE | ID na rota |

### Autenticação (Authentication)

| Antiga (Legacy) | Nova (v1) | Método | Mudanças |
|----------------|-----------|--------|----------|
| `POST /api/jwt/login` | `POST /api/v1/auth/login` | POST | Rota simplificada |

### Pedidos (Orders)

| Antiga (Legacy) | Nova (v1) | Método | Mudanças |
|----------------|-----------|--------|----------|
| `GET /api/pedidos` | `GET /api/v1/orders` | GET | Nome em inglês |
| `POST /api/pedidos` | `POST /api/v1/orders` | POST | Nome em inglês |
| `PUT /api/pedidos` | `PUT /api/v1/orders` | PUT | Removido |
| `DELETE /api/pedidos?id={id}` | `DELETE /api/v1/orders/{id}` | DELETE | ID na rota |
| N/A | `GET /api/v1/orders?customerId={id}` | GET | Nova funcionalidade |
| N/A | `GET /api/v1/orders/{id}` | GET | Nova funcionalidade |

### Sabores (Flavors)

| Antiga (Legacy) | Nova (v1) | Método | Mudanças |
|----------------|-----------|--------|----------|
| `GET /api/sabores` | `GET /api/v1/flavors` | GET | Nome em inglês |
| `POST /api/sabores` | N/A | POST | Removido da API pública |
| `DELETE /api/sabores?id={id}` | N/A | DELETE | Removido da API pública |
| N/A | `GET /api/v1/flavors/{id}` | GET | Nova funcionalidade |

### Adicionais (Additionals)

| Antiga (Legacy) | Nova (v1) | Método | Mudanças |
|----------------|-----------|--------|----------|
| `GET /api/adicionais` | `GET /api/v1/additionals` | GET | Nome em inglês |
| `POST /api/adicionais` | N/A | POST | Removido da API pública |
| `DELETE /api/adicionais?id={id}` | N/A | DELETE | Removido da API pública |
| N/A | `GET /api/v1/additionals/{id}` | GET | Nova funcionalidade |

---

## Exemplos de Migração

### 1. Criar Cliente

#### Antes (Legacy)
```bash
POST /api/clientes
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "senha123"
}
```

#### Depois (v1)
```bash
POST /api/v1/customers
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Mudanças:**
- Rota: `/clientes` → `/customers`
- Campos: `nome` → `name`, `senha` → `password`

---

### 2. Deletar Cliente

#### Antes (Legacy)
```bash
DELETE /api/clientes?id=1
```

#### Depois (v1)
```bash
DELETE /api/v1/customers/1
```

**Mudanças:**
- Query param `?id=1` → Path param `/1`
- Mais RESTful e semântico

---

### 3. Login

#### Antes (Legacy)
```bash
POST /api/jwt/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "nome": "João Silva"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1..."
}
```

#### Depois (v1)
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1...",
  "customer": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com"
  }
}
```

**Mudanças:**
- Rota: `/jwt/login` → `/auth/login`
- Agora valida senha (mais seguro)
- Retorna informações do cliente junto com token

---

### 4. Criar Pedido

#### Antes (Legacy)
```bash
POST /api/pedidos
Content-Type: application/json

{
  "clienteId": 1,
  "sabores": [
    { "id": 4 },
    { "id": 5 }
  ],
  "adicionais": [
    { "id": 11 }
  ],
  "tamanho": "Grande",
  "valorTotal": 35.50,
  "formaPagamento": "Pix",
  "enderecoEntrega": "Rua Principal, 456"
}
```

#### Depois (v1)
```bash
POST /api/v1/orders
Content-Type: application/json

{
  "customerId": 1,
  "flavorIds": [4, 5],
  "additionalIds": [11],
  "size": "Grande",
  "totalValue": 35.50,
  "paymentMethod": "Pix",
  "deliveryAddress": "Rua Principal, 456"
}
```

**Mudanças:**
- Campos em inglês (camelCase)
- `sabores: [{ id: 4 }]` → `flavorIds: [4]` (mais simples)
- `adicionais: [{ id: 11 }]` → `additionalIds: [11]`
- Campos: `clienteId` → `customerId`, `tamanho` → `size`, etc.

---

## Mudanças no Frontend

### Atualizar Chamadas de API

#### React/Next.js
```typescript
// Antes (Legacy)
const response = await fetch('/api/clientes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nome: 'João',
    email: 'joao@email.com',
    senha: 'senha123'
  })
});

// Depois (v1)
const response = await fetch('/api/v1/customers', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'João',
    email: 'joao@email.com',
    password: 'senha123'
  })
});
```

### Criar Arquivo de Configuração de API

```typescript
// src/lib/api-config.ts
export const API_VERSION = 'v1';
export const API_BASE_URL = `/api/${API_VERSION}`;

export const API_ENDPOINTS = {
  customers: {
    list: `${API_BASE_URL}/customers`,
    create: `${API_BASE_URL}/customers`,
    byId: (id: number) => `${API_BASE_URL}/customers/${id}`,
    update: `${API_BASE_URL}/customers`,
    delete: (id: number) => `${API_BASE_URL}/customers/${id}`,
  },
  auth: {
    login: `${API_BASE_URL}/auth/login`,
  },
  orders: {
    list: `${API_BASE_URL}/orders`,
    create: `${API_BASE_URL}/orders`,
    byId: (id: number) => `${API_BASE_URL}/orders/${id}`,
    byCustomer: (customerId: number) => `${API_BASE_URL}/orders?customerId=${customerId}`,
    delete: (id: number) => `${API_BASE_URL}/orders/${id}`,
  },
  flavors: {
    list: `${API_BASE_URL}/flavors`,
    byId: (id: number) => `${API_BASE_URL}/flavors/${id}`,
  },
  additionals: {
    list: `${API_BASE_URL}/additionals`,
    byId: (id: number) => `${API_BASE_URL}/additionals/${id}`,
  },
};
```

### Exemplo de Uso

```typescript
import { API_ENDPOINTS } from '@/lib/api-config';

// Criar cliente
const response = await fetch(API_ENDPOINTS.customers.create, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(customerData)
});

// Buscar cliente por ID
const customer = await fetch(API_ENDPOINTS.customers.byId(1));

// Listar pedidos de um cliente
const orders = await fetch(API_ENDPOINTS.orders.byCustomer(1));
```

---

## Breaking Changes

### 1. Estrutura de Resposta de Erro
Antes era inconsistente, agora é padronizada:

```json
{
  "error": "Customer not found"
}
```

### 2. Campos em Inglês
Todos os campos foram traduzidos:
- `nome` → `name`
- `senha` → `password`
- `clienteId` → `customerId`
- `tamanho` → `size`
- `valorTotal` → `totalValue`
- `formaPagamento` → `paymentMethod`
- `enderecoEntrega` → `deliveryAddress`

### 3. IDs na Rota (não mais query params)
```
Antes: DELETE /api/clientes?id=1
Depois: DELETE /api/v1/customers/1
```

### 4. Sabores e Adicionais simplificados
```typescript
// Antes
{
  "sabores": [{ "id": 1 }, { "id": 2 }],
  "adicionais": [{ "id": 3 }]
}

// Depois
{
  "flavorIds": [1, 2],
  "additionalIds": [3]
}
```

---

## Checklist de Migração

- [ ] Atualizar todas as chamadas de API para `/api/v1/*`
- [ ] Renomear campos para inglês (camelCase)
- [ ] Atualizar DELETEs para usar path params
- [ ] Ajustar estrutura de pedidos (IDs diretos)
- [ ] Atualizar tratamento de erros
- [ ] Testar todos os fluxos
- [ ] Remover dependência da API legacy
- [ ] Atualizar documentação

---

## Testando a Migração

### 1. Teste Paralelo
Execute ambas as APIs simultaneamente para comparar:

```bash
# Legacy
curl http://localhost:3000/api/clientes

# v1
curl http://localhost:3000/api/v1/customers
```

### 2. Validação de Resposta
Verifique que as respostas são consistentes (mesmo dados, formatação diferente).

### 3. Teste de Integração
Execute os testes para garantir que tudo funciona:

```bash
npm test
```

---

## Recursos Adicionais

- [Documentação completa da API v1](./API_GUIDE.md)
- [Arquitetura do projeto](./ARCHITECTURE.md)
- [Diagramas visuais](./ARCHITECTURE_DIAGRAM.md)

---

## Suporte

Se encontrar problemas na migração:
1. Verifique os logs do servidor
2. Compare com exemplos em [API_GUIDE.md](./API_GUIDE.md)
3. Teste com Postman/cURL para isolar problemas

---

**Dica:** Mantenha a API legacy funcionando durante o período de migração para garantir zero downtime.

````
