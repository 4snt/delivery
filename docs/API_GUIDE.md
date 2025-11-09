# 🚀 Guia de Uso das APIs - Delivery System

## 📡 Base URL
```
http://localhost:3000/api/v1
```

## 🔐 Autenticação

### Login (Obter JWT Token)
```bash
POST /api/v1/auth/login

Body:
{
  "email": "cliente@email.com",
  "password": "senha123"
}

Response (200 OK):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "customer": {
    "id": 1,
    "name": "João Silva",
    "email": "cliente@email.com"
  }
}

Response (401 Unauthorized):
{
  "error": "Invalid credentials"
}
```

---

## 👥 Clientes (Customers)

### 1. Criar Cliente
```bash
POST /api/v1/customers

Body:
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}

Response (201 Created):
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@email.com"
}

Response (409 Conflict):
{
  "error": "Customer with this email already exists"
}

Response (400 Bad Request):
{
  "error": "Name, email and password are required"
}
```

### 2. Listar Todos os Clientes
```bash
GET /api/v1/customers

Response (200 OK):
[
  {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com"
  },
  {
    "id": 2,
    "name": "Maria Santos",
    "email": "maria@email.com"
  }
]
```

### 3. Buscar Cliente por Email
```bash
GET /api/v1/customers?email=joao@email.com

Response (200 OK):
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@email.com"
}

Response (404 Not Found):
{
  "error": "Customer not found"
}
```

### 4. Buscar Cliente por ID
```bash
GET /api/v1/customers/1

Response (200 OK):
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@email.com"
}

Response (404 Not Found):
{
  "error": "Customer not found"
}
```

### 5. Atualizar Cliente
```bash
PUT /api/v1/customers

Body:
{
  "email": "joao@email.com",
  "name": "João Silva Atualizado",
  "password": "novaSenha123"  // opcional
}

Response (200 OK):
{
  "id": 1,
  "name": "João Silva Atualizado",
  "email": "joao@email.com"
}

Response (404 Not Found):
{
  "error": "Customer not found"
}
```

### 6. Deletar Cliente
```bash
DELETE /api/v1/customers/1

Response (200 OK):
{
  "message": "Customer deleted successfully"
}

Response (404 Not Found):
{
  "error": "Customer not found"
}
```

---

## 🍦 Sabores (Flavors)

### 1. Listar Todos os Sabores
```bash
GET /api/v1/flavors

Response (200 OK):
[
  {
    "id": 1,
    "name": "Chocolate",
    "image": "/images/chocolate.jpg"
  },
  {
    "id": 2,
    "name": "Morango",
    "image": "/images/morango.jpg"
  }
]
```

### 2. Buscar Sabor por ID
```bash
GET /api/v1/flavors/1

Response (200 OK):
{
  "id": 1,
  "name": "Chocolate",
  "image": "/images/chocolate.jpg"
}

Response (404 Not Found):
{
  "error": "Flavor not found"
}
```

---

## 🍒 Adicionais (Additionals)

### 1. Listar Todos os Adicionais
```bash
GET /api/v1/additionals

Response (200 OK):
[
  {
    "id": 1,
    "name": "Granulado"
  },
  {
    "id": 2,
    "name": "Calda de Chocolate"
  }
]
```

### 2. Buscar Adicional por ID
```bash
GET /api/v1/additionals/1

Response (200 OK):
{
  "id": 1,
  "name": "Granulado"
}

Response (404 Not Found):
{
  "error": "Additional not found"
}
```

---

## 📦 Pedidos (Orders)

### 1. Criar Pedido
```bash
POST /api/v1/orders

Body:
{
  "customerId": 1,
  "flavorIds": [1, 2],
  "additionalIds": [1],
  "size": "M",
  "totalValue": 25.50,
  "paymentMethod": "credit_card",
  "deliveryAddress": "Rua das Flores, 123"
}

Response (201 Created):
{
  "id": 1,
  "customerId": 1,
  "flavorIds": [1, 2],
  "additionalIds": [1],
  "size": "M",
  "totalValue": 25.50,
  "paymentMethod": "credit_card",
  "deliveryAddress": "Rua das Flores, 123",
  "createdAt": "2025-11-09T10:30:00.000Z"
}

Response (400 Bad Request):
{
  "error": "CustomerId, size, paymentMethod and deliveryAddress are required"
}

Response (400 Bad Request):
{
  "error": "At least one flavor is required"
}
```

### 2. Listar Todos os Pedidos
```bash
GET /api/v1/orders

Response (200 OK):
[
  {
    "id": 1,
    "customerId": 1,
    "flavorIds": [1, 2],
    "additionalIds": [1],
    "size": "M",
    "totalValue": 25.50,
    "paymentMethod": "credit_card",
    "deliveryAddress": "Rua das Flores, 123",
    "createdAt": "2025-11-09T10:30:00.000Z"
  }
]
```

### 3. Listar Pedidos por Cliente
```bash
GET /api/v1/orders?customerId=1

Response (200 OK):
[
  {
    "id": 1,
    "customerId": 1,
    "flavorIds": [1, 2],
    "additionalIds": [1],
    "size": "M",
    "totalValue": 25.50,
    "paymentMethod": "credit_card",
    "deliveryAddress": "Rua das Flores, 123",
    "createdAt": "2025-11-09T10:30:00.000Z"
  }
]
```

### 4. Buscar Pedido por ID
```bash
GET /api/v1/orders/1

Response (200 OK):
{
  "id": 1,
  "customerId": 1,
  "flavorIds": [1, 2],
  "additionalIds": [1],
  "size": "M",
  "totalValue": 25.50,
  "paymentMethod": "credit_card",
  "deliveryAddress": "Rua das Flores, 123",
  "createdAt": "2025-11-09T10:30:00.000Z"
}

Response (404 Not Found):
{
  "error": "Order not found"
}
```

### 5. Deletar Pedido
```bash
DELETE /api/v1/orders/1

Response (200 OK):
{
  "message": "Order deleted successfully"
}

Response (404 Not Found):
{
  "error": "Order not found"
}
```

---

## 🧪 Testando com cURL

### Criar Cliente
```bash
curl -X POST http://localhost:3000/api/v1/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "senha123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "senha123"
  }'
```

### Criar Pedido
```bash
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

### Listar Sabores
```bash
curl http://localhost:3000/api/v1/flavors
```

---

## 📊 Códigos de Status HTTP

| Código | Significado | Quando Usar |
|--------|-------------|-------------|
| 200 | OK | Operação bem-sucedida (GET, PUT, DELETE) |
| 201 | Created | Recurso criado com sucesso (POST) |
| 400 | Bad Request | Dados inválidos ou faltando |
| 401 | Unauthorized | Credenciais inválidas |
| 404 | Not Found | Recurso não encontrado |
| 409 | Conflict | Recurso já existe (ex: email duplicado) |
| 500 | Internal Server Error | Erro do servidor |

---

## 🔄 Fluxo Típico de Uso

### 1. Cadastrar Cliente
```bash
POST /api/v1/customers
```

### 2. Fazer Login
```bash
POST /api/v1/auth/login
# Retorna token JWT
```

### 3. Consultar Sabores Disponíveis
```bash
GET /api/v1/flavors
```

### 4. Consultar Adicionais Disponíveis
```bash
GET /api/v1/additionals
```

### 5. Criar Pedido
```bash
POST /api/v1/orders
```

### 6. Consultar Pedidos do Cliente
```bash
GET /api/v1/orders?customerId={id}
```

---

## 💡 Dicas

- Todas as senhas são hasheadas com BCrypt antes de serem salvas
- Os tokens JWT são válidos por 7 dias
- O campo `password` nunca é retornado nas respostas (segurança)
- IDs são auto-incrementais
- Timestamps são em formato ISO 8601 (UTC)

---

## 🛠️ Collection Postman

Para facilitar os testes, você pode importar esta collection no Postman:

```json
{
  "info": {
    "name": "Delivery API v1",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Customers",
      "item": [
        {
          "name": "Create Customer",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/v1/customers",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"João Silva\",\n  \"email\": \"joao@email.com\",\n  \"password\": \"senha123\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    }
  ]
}
```

---

**📚 Para mais detalhes sobre a arquitetura, consulte [ARCHITECTURE.md](./ARCHITECTURE.md)**
