# Trabalho de Banco de Dados II - Sistema de Delivery

## Informações do Projeto

**Sistema:** Aplicação Web de Delivery de Pizzaria  
**Tecnologias:** Next.js, TypeScript, Prisma ORM, PostgreSQL  
**Data de Apresentação:** 02 e 03/12/2025

---

## 1. Requisitos Funcionais do Sistema

### a) Funcionalidades Implementadas

#### Gestão de Clientes
- Cadastro de clientes com informações completas
- Sistema de autenticação (login/logout)
- Gerenciamento de perfil de usuário
- Sistema de pontos de fidelidade
- Controle de administradores

#### Gestão de Produtos
- Cadastro de sabores de pizza (categorizado por tipo: Tradicional, Premium, Especial)
- Gestão de adicionais/ingredientes extras
- Controle de preços e disponibilidade
- Categorização de produtos

#### Gestão de Pedidos
- Criação de pedidos com múltiplos itens
- Seleção de sabores e adicionais
- Cálculo automático de valores
- Acompanhamento de status do pedido
- Histórico completo de pedidos

#### Sistema de Fidelidade
- Acúmulo de pontos por pedido
- Geração de cupons de desconto
- Validação e aplicação de cupons
- Controle de validade de cupons

#### Dashboard Administrativo
- Visualização de estatísticas de vendas
- Gestão de produtos e clientes
- Controle de pedidos em tempo real
- Relatórios de desempenho

---

## 2. Requisitos Técnicos de SQL/Transact-SQL

### Explicação: O que são Transações?

Uma **transação** é um conjunto de operações de banco de dados que devem ser executadas como uma unidade atômica. Isso significa que:
- **Todas as operações são concluídas com sucesso**, OU
- **Nenhuma operação é aplicada** (rollback automático)

Isso garante a **integridade dos dados** em operações complexas, evitando estados inconsistentes no banco.

**Propriedades ACID das Transações:**
- **A**tomicidade: Tudo ou nada
- **C**onsistência: Dados sempre em estado válido
- **I**solamento: Transações não interferem entre si
- **D**urabilidade: Mudanças persistem após commit

### a) Uso de Transações

O sistema utiliza transações do Prisma (`$transaction`) para garantir integridade em operações compostas:

**Exemplo 1: Criação de Pedido com Múltiplos Itens**
```typescript
// src/core/application/use-cases/create-pedido.use-case.ts
async execute(input: CreatePedidoInput): Promise<Either<Error, PedidoOutput>> {
  return await this.prismaService.$transaction(async (prisma) => {
    // 1. Criar o pedido
    const pedido = await prisma.pedido.create({
      data: {
        clienteId: input.clienteId,
        total: input.total,
        status: 'PENDENTE',
        dataHora: new Date(),
      }
    });

    // 2. Criar itens do pedido
    for (const item of input.itens) {
      await prisma.itemPedido.create({
        data: {
          pedidoId: pedido.id,
          saborId: item.saborId,
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario,
          adicionais: {
            connect: item.adicionaisIds.map(id => ({ id }))
          }
        }
      });
    }

    // 3. Atualizar pontos do cliente
    await prisma.cliente.update({
      where: { id: input.clienteId },
      data: {
        pontosAcumulados: {
          increment: Math.floor(input.total / 10)
        }
      }
    });

    return right(pedido);
  });
}
```

**Exemplo 2: Aplicação de Cupom e Desconto**
```typescript
// Operação atômica: valida cupom, aplica desconto e marca cupom como usado
await prisma.$transaction(async (tx) => {
  const cupom = await tx.cupom.findFirst({
    where: { codigo: input.codigoCupom, usado: false }
  });
  
  if (!cupom || cupom.validade < new Date()) {
    throw new Error('Cupom inválido');
  }

  await tx.cupom.update({
    where: { id: cupom.id },
    data: { usado: true }
  });

  await tx.pedido.update({
    where: { id: input.pedidoId },
    data: { 
      total: { decrement: cupom.desconto },
      cupomId: cupom.id 
    }
  });
});
```

### b) Consultas SQL com Junções

#### Explicação: O que são Junções (JOINs)?

**Junções** são operações que combinam linhas de duas ou mais tabelas baseadas em uma condição relacionada entre elas. São essenciais em bancos relacionais para recuperar dados de múltiplas tabelas.

**Tipos de JOIN:**
- **INNER JOIN:** Retorna apenas registros com correspondência em ambas as tabelas
- **LEFT JOIN:** Retorna todos da tabela esquerda + correspondentes da direita
- **RIGHT JOIN:** Retorna todos da tabela direita + correspondentes da esquerda
- **FULL JOIN:** Retorna todos os registros de ambas as tabelas

#### Comando Prisma para Consultas com Relacionamentos

```typescript
// Buscar pedidos com informações do cliente e itens (INNER JOIN automático)
const pedidos = await prisma.pedido.findMany({
  include: {
    cliente: true,           // JOIN com tabela Cliente
    itens: {                 // JOIN com tabela ItemPedido
      include: {
        sabor: true,         // JOIN com tabela Sabor
        adicionais: {        // JOINMany-to-Many com Adicional
          include: {
            adicional: true
          }
        }
      }
    },
    cupom: true             // LEFT JOIN com tabela Cupom (opcional)
  },
  where: {
    status: 'CONCLUIDO'
  },
  orderBy: {
    dataHora: 'desc'
  }
});
```

**SQL Gerado pelo Prisma:**
```sql
SELECT 
  p.*,
  c.nome, c.email, c.telefone,
  ip.*, s.nome as sabor_nome,
  a.nome as adicional_nome
FROM "Pedido" p
INNER JOIN "Cliente" c ON p."clienteId" = c.id
INNER JOIN "ItemPedido" ip ON ip."pedidoId" = p.id
INNER JOIN "Sabor" s ON ip."saborId" = s.id
LEFT JOIN "ItemPedidoAdicional" ipa ON ipa."itemPedidoId" = ip.id
LEFT JOIN "Adicional" a ON ipa."adicionalId" = a.id
LEFT JOIN "Cupom" cu ON p."cupomId" = cu.id
WHERE p.status = 'CONCLUIDO'
ORDER BY p."dataHora" DESC;
```

**Exemplo: Listagem de Pedidos com Detalhes Completos (SQL Puro)**
```sql
SELECT 
  p.id,
  p.dataHora,
  p.total,
  p.status,
  c.nome as clienteNome,
  c.telefone as clienteTelefone,
  json_agg(
    json_build_object(
      'sabor', s.nome,
      'quantidade', ip.quantidade,
      'preco', ip.precoUnitario
    )
  ) as itens
FROM Pedido p
INNER JOIN Cliente c ON p.clienteId = c.id
INNER JOIN ItemPedido ip ON ip.pedidoId = p.id
INNER JOIN Sabor s ON ip.saborId = s.id
GROUP BY p.id, c.nome, c.telefone
ORDER BY p.dataHora DESC;
```

**Exemplo: Dashboard de Estatísticas**
```sql
SELECT 
  COUNT(DISTINCT p.id) as totalPedidos,
  SUM(p.total) as valorTotal,
  AVG(p.total) as ticketMedio,
  COUNT(DISTINCT p.clienteId) as clientesUnicos
FROM Pedido p
WHERE p.dataHora >= CURRENT_DATE - INTERVAL '30 days'
  AND p.status = 'CONCLUIDO';
```

### c) Stored Procedures

**Procedure: Gerar Cupom de Fidelidade**
```sql
CREATE OR REPLACE PROCEDURE gerar_cupom_fidelidade(
  p_cliente_id BIGINT,
  p_pontos_necessarios INTEGER DEFAULT 100
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_pontos INTEGER;
  v_desconto DECIMAL(10,2);
BEGIN
  -- Verificar pontos do cliente
  SELECT pontosAcumulados INTO v_pontos
  FROM Cliente
  WHERE id = p_cliente_id;

  IF v_pontos >= p_pontos_necessarios THEN
    -- Calcular desconto (10% do valor acumulado)
    v_desconto := (v_pontos / 10.0);

    -- Criar cupom
    INSERT INTO Cupom (clienteId, codigo, desconto, validade, usado)
    VALUES (
      p_cliente_id,
      'FIDELIDADE' || to_char(NOW(), 'YYYYMMDDHH24MISS'),
      v_desconto,
      CURRENT_DATE + INTERVAL '30 days',
      false
    );

    -- Deduzir pontos
    UPDATE Cliente
    SET pontosAcumulados = pontosAcumulados - p_pontos_necessarios
    WHERE id = p_cliente_id;

    RAISE NOTICE 'Cupom gerado com sucesso! Desconto: R$ %', v_desconto;
  ELSE
    RAISE EXCEPTION 'Pontos insuficientes. Necessário: %, Atual: %', 
      p_pontos_necessarios, v_pontos;
  END IF;
END;
$$;
```

**Procedure: Atualizar Status do Pedido**
```sql
CREATE OR REPLACE PROCEDURE atualizar_status_pedido(
  p_pedido_id BIGINT,
  p_novo_status VARCHAR(20)
)
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE Pedido
  SET 
    status = p_novo_status,
    updatedAt = CURRENT_TIMESTAMP
  WHERE id = p_pedido_id;

  -- Log da alteração
  INSERT INTO LogPedido (pedidoId, statusAnterior, statusNovo, dataHora)
  SELECT 
    p_pedido_id,
    LAG(status) OVER (ORDER BY updatedAt),
    p_novo_status,
    CURRENT_TIMESTAMP
  FROM Pedido
  WHERE id = p_pedido_id;

  RAISE NOTICE 'Status do pedido % atualizado para %', p_pedido_id, p_novo_status;
END;
$$;
```

### d) Comandos SQL Básicos

#### Explicação dos Comandos CRUD

**CRUD** significa Create, Read, Update, Delete - as 4 operações básicas de qualquer banco de dados:
- **CREATE (INSERT):** Inserir novos registros
- **READ (SELECT):** Consultar dados existentes
- **UPDATE:** Modificar registros existentes
- **DELETE:** Remover registros

#### SELECT - Consultar Dados

O comando **SELECT** é usado para recuperar dados do banco. Pode incluir filtros (WHERE), ordenação (ORDER BY), agrupamento (GROUP BY) e limitação (LIMIT).

**Comandos Prisma:**
#### INSERT - Inserir Dados

O comando **INSERT** adiciona novos registros ao banco de dados.

**Comandos Prisma:**
```typescript
// INSERT simples - criar novo cliente
const novoCliente = await prisma.cliente.create({
  data: {
    nome: 'João Silva',
    email: 'joao@email.com',
#### UPDATE - Atualizar Dados

O comando **UPDATE** modifica registros existentes no banco.

**Comandos Prisma:**
```typescript
// UPDATE simples - atualizar telefone do cliente
const clienteAtualizado = await prisma.cliente.update({
  where: { id: 1 },
  data: {
    telefone: '11988888888',
    endereco: 'Rua B, 456'
  }
});

// UPDATE com incremento - adicionar pontos
const clienteComPontos = await prisma.cliente.update({
  where: { id: 1 },
  data: {
    pontosAcumulados: {
      increment: 50  // Adiciona 50 pontos ao valor atual
    }
  }
});

// UPDATE condicional - atualizar status do pedido
const pedidoAtualizado = await prisma.pedido.updateMany({
  where: {
    status: 'PENDENTE',
    dataHora: {
      lt: new Date(Date.now() - 30 * 60 * 1000) // mais de 30min
    }
  },
  data: {
    status: 'EM_PREPARO'
  }
});

// UPDATE com relacionamento - marcar cupom como usado
const cupomUsado = await prisma.cupom.update({
  where: { codigo: 'FIDELIDADE2025' },
  data: {
    usado: true,
    pedido: {
      connect: { id: 123 }  // Associa ao pedido
    }
  }
});
```

**SQL Equivalente:**e: '11999999999',
    senha: await hash('senha123'),
    endereco: 'Rua A, 123',
    pontosAcumulados: 0,
    isAdmin: false
  }
});

// INSERT com relacionamento - criar sabor
const novoSabor = await prisma.sabor.create({
  data: {
    nome: 'Calabresa Especial',
#### DELETE - Remover Dados

O comando **DELETE** remove registros do banco de dados.

**Comandos Prisma:**
```typescript
// DELETE simples - remover sabor específico
const saborRemovido = await prisma.sabor.delete({
  where: { id: 5 }
});

// DELETE múltiplo com condição - limpar cupons expirados
const cuponsRemovidos = await prisma.cupom.deleteMany({
## 3. Estrutura do Banco de Dados

### Explicação: Modelo Relacional

O **modelo relacional** organiza dados em tabelas (relações) com linhas (tuplas) e colunas (atributos). As tabelas se relacionam através de **chaves primárias** (PK) e **chaves estrangeiras** (FK).

**Conceitos Fundamentais:**
- **Chave Primária (PK):** Identificador único de cada registro
- **Chave Estrangeira (FK):** Referência à PK de outra tabela
- **Relacionamentos:** 1:1, 1:N, N:N (muitos-para-muitos)
- **Normalização:** Organização para evitar redundância

**Tipos de Relacionamento no Sistema:**
1. **1:N (Um para Muitos):** Um cliente tem vários pedidos
2. **N:M (Muitos para Muitos):** ItemPedido pode ter vários adicionais
3. **1:1 (Um para Um):** Pedido pode ter um cupom

### Modelo de Dados Relacional (PostgreSQL)

O sistema utiliza **múltiplas tabelas** com relacionamentos complexos, totalizando **7 tabelas principais** + **1 tabela de junção**:
  }
});

// DELETE em cascata (configurado no schema)
// Ao deletar um pedido, remove automaticamente seus itens
const pedidoDeletado = await prisma.pedido.delete({
  where: { id: 10 },
  include: {
    itens: true  // Retorna itens que foram deletados em cascata
  }
});

// Soft delete - marcar como inativo ao invés de deletar
const saborDesativado = await prisma.sabor.update({
  where: { id: 5 },
  data: { disponivel: false }
});
```

**SQL Equivalente:**ao: 'Calabresa artesanal com cebola caramelizada',
    preco: 52.90,
    tipo: 'ESPECIAL',
    disponivel: true,
    imagemUrl: '/images/calabresa-especial.jpg'
  }
});

// INSERT múltiplo - vários registros de uma vez
const novosAdicionais = await prisma.adicional.createMany({
  data: [
    { nome: 'Queijo Extra', preco: 5.00, disponivel: true },
    { nome: 'Bacon', preco: 6.00, disponivel: true },
    { nome: 'Catupiry', preco: 7.00, disponivel: true }
  ]
});
```

**SQL Equivalente:**pt
// SELECT simples - buscar todos os sabores
const sabores = await prisma.sabor.findMany();

// SELECT com filtro WHERE
const saboresPremium = await prisma.sabor.findMany({
  where: {
    tipo: 'PREMIUM',
    disponivel: true
  }
});

// SELECT com ordenação
const pedidosRecentes = await prisma.pedido.findMany({
  orderBy: {
    dataHora: 'desc'
  },
  take: 10  // LIMIT 10
});

// SELECT com busca por ID único
const cliente = await prisma.cliente.findUnique({
  where: { id: 1 }
});

// SELECT com filtros complexos (AND, OR)
const pedidosCliente = await prisma.pedido.findMany({
  where: {
    AND: [
      { clienteId: 1 },
      { status: { in: ['PENDENTE', 'EM_PREPARO'] } }
    ]
  }
});
```

**SQL Equivalente:**
```sql
-- Buscar pedidos de um cliente específico
SELECT * FROM Pedido 
WHERE clienteId = 1 
ORDER BY dataHora DESC;

-- Sabores por categoria
### Schema Prisma Completo

#### Explicação do Schema

// Tabela de Clientes
// Relacionamento: 1 Cliente -> N Pedidos (1:N)
// Relacionamento: 1 Cliente -> N Cupons (1:N)
model Cliente {
  id                BigInt   @id @default(autoincrement())  // PK auto-incremento
  nome              String                                  // NOT NULL
  email             String   @unique                        // UNIQUE constraint
  telefone          String
  senha             String                                  // Hash bcrypt
  endereco          String
  pontosAcumulados  Int      @default(0)                   // Inicia com 0
  isAdmin           Boolean  @default(false)               // Flag de administrador
  pedidos           Pedido[]                               // Relacionamento 1:N
  cupons            Cupom[]                                // Relacionamento 1:N
  createdAt         DateTime @default(now())               // Timestamp de criação
// Tabela de Sabores de Pizza
// Relacionamento: 1 Sabor -> N ItemPedido (1:N)
model Sabor {
  id          BigInt       @id @default(autoincrement())
  nome        String
  descricao   String?                                      // Campo opcional
  preco       Decimal      @db.Decimal(10, 2)             // Precisão: 10 dígitos, 2 casas decimais
  tipo        TipoSabor                                    // ENUM: TRADICIONAL, PREMIUM, ESPECIAL
  disponivel  Boolean      @default(true)
  imagemUrl   String?                                      // URL da imagem (opcional)
  itens       ItemPedido[]                                 // Relacionamento 1:N
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  
  @@index([tipo, disponivel])                              // Índice composto para filtros
  @@map("Sabor")
}

// Tabela de Adicionais/Ingredientes Extras
// Relacionamento N:M com ItemPedido através de ItemPedidoAdicional
model Adicional {
  id          BigInt                  @id @default(autoincrement())
  nome        String
  preco       Decimal                 @db.Decimal(10, 2)
  disponivel  Boolean                 @default(true)
  itens       ItemPedidoAdicional[]   // Relacionamento N:M
  createdAt   DateTime                @default(now())
  updatedAt   DateTime                @updatedAt
  
  @@map("Adicional")
}atasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// MODELOS (TABELAS)
// ============================================

#### INSERT
```sql
-- Inserir novo cliente
INSERT INTO Cliente (nome, email, telefone, senha, endereco)
VALUES ('João Silva', 'joao@email.com', '11999999999', 'hash_senha', 'Rua A, 123');

-- Inserir novo sabor
INSERT INTO Sabor (nome, descricao, preco, tipo, disponivel)
VALUES ('Calabresa', 'Pizza de calabresa com cebola', 45.00, 'TRADICIONAL', true);
```

#### UPDATE
```sql
-- Atualizar dados do cliente
UPDATE Cliente 
SET telefone = '11988888888', endereco = 'Rua B, 456'
WHERE id = 1;

-- Atualizar status do pedido
UPDATE Pedido 
SET status = 'EM_PREPARO'
WHERE id = 1;
// Tabela de Pedidos
// Relacionamento: N Pedidos -> 1 Cliente (N:1)
// Relacionamento: 1 Pedido -> N ItemPedido (1:N)
// Relacionamento: N Pedidos -> 1 Cupom (N:1, opcional)
model Pedido {
  id        BigInt       @id @default(autoincrement())
  clienteId BigInt                                         // FK para Cliente
  cliente   Cliente      @relation(fields: [clienteId], references: [id], onDelete: Cascade)
  dataHora  DateTime     @default(now())
  total     Decimal      @db.Decimal(10, 2)
  status    StatusPedido @default(PENDENTE)               // ENUM de status
  cupomId   BigInt?                                        // FK opcional para Cupom
// ============================================
// ENUMS (Tipos Enumerados)
// ============================================

// Enum para categorização de sabores
enum TipoSabor {
  TRADICIONAL    // Sabores clássicos (ex: Mussarela, Calabresa)
  PREMIUM        // Sabores especiais com ingredientes nobres
  ESPECIAL       // Sabores exclusivos da casa
  
  @@map("TipoSabor")
}

// Enum para status do pedido (máquina de estados)
enum StatusPedido {
### Comandos Prisma para Gerenciamento do Schema

```bash
# Gerar Prisma Client (código TypeScript) a partir do schema
npx prisma generate

# Criar uma migration (versionar mudanças no schema)
npx prisma migrate dev --name descricao_da_mudanca

# Aplicar migrations em produção
npx prisma migrate deploy

# Visualizar o banco de dados no navegador (GUI)
npx prisma studio

# Resetar banco e aplicar todas as migrations
npx prisma migrate reset

# Verificar status das migrations
npx prisma migrate status

# Validar o schema sem criar migration
npx prisma validate

# Formatar o arquivo schema.prisma
npx prisma format

# Popular o banco com dados iniciais (seed)
npx prisma db seed
```

### Explicação: Migrations

**Migrations** são arquivos SQL versionados que representam mudanças incrementais no schema do banco de dados. Elas permitem:
- **Versionar** o schema junto com o código
- **Sincronizar** estrutura do banco entre ambientes
- **Rastrear** histórico de mudanças
- **Aplicar/reverter** alterações de forma controlada

Cada migration é armazenada em `prisma/migrations/` com timestamp e nome descritivo.

---

## 4. Demonstração do Sistemaiu para entrega
  CONCLUIDO      // Pedido entregue/finalizado
  CANCELADO      // Pedido cancelado
  
  @@map("StatusPedido")
}
```

### Diagrama de Relacionamentos (ER)

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Cliente   │1      N │   Pedido    │N      1 │    Cupom    │
│─────────────│◄────────│─────────────│────────►│─────────────│
│ id (PK)     │         │ id (PK)     │         │ id (PK)     │
│ nome        │         │ clienteId FK│         │ clienteId FK│
│ email       │         │ total       │         │ codigo      │
│ pontos      │         │ status      │         │ desconto    │
└─────────────┘         │ cupomId FK  │         └─────────────┘
                        └─────────────┘
                               │1
                               │
                               │N
                        ┌──────────────┐
                        │  ItemPedido  │
                        │──────────────│
                        │ id (PK)      │
                        │ pedidoId FK  │
                        │ saborId FK   │
                        │ quantidade   │
                        └──────────────┘
                           │N      │N
                     ┌─────┘       └─────┐
                     │1                   │M
              ┌──────────┐    ┌──────────────────────┐    ┌────────────┐
              │  Sabor   │    │ItemPedidoAdicional   │    │ Adicional  │
              │──────────│    │──────────────────────│    │────────────│
              │ id (PK)  │    │ itemPedidoId FK (PK) │    │ id (PK)    │
              │ nome     │    │ adicionalId FK (PK)  │    │ nome       │
              │ preco    │    └──────────────────────┘    │ preco      │
## 5. Conexão com o Banco de Dados

### Explicação: Prisma Client

O **Prisma Client** é um gerador de queries type-safe gerado automaticamente a partir do schema. Ele:
- Fornece **autocomplete** completo no VS Code
- Garante **type safety** em tempo de compilação
- Gera **queries otimizadas** automaticamente
- Abstrai diferenças entre bancos de dados
- Previne **SQL Injection** por design

### Arquivo de Configuração Prisma

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Declaração global para evitar múltiplas instâncias em dev (hot reload)
declare global {
  var prisma: PrismaClient | undefined;
}

// Singleton: reutiliza instância existente ou cria nova
export const prisma = global.prisma || new PrismaClient({
  log: ['query', 'error', 'warn'],  // Logs de queries e erros
  // log: ['query'],                // Para ver todas as queries SQL geradas
});

// Em desenvolvimento, armazena na variável global
// para persistir entre hot reloads do Next.js
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Hooks do Prisma para transformações
### Inicialização e Seeds

#### Explicação: Database Seeding

**Seeding** é o processo de popular o banco com dados iniciais para desenvolvimento/teste. É útil para:
- Criar dados de exemplo consistentes
- Testar funcionalidades com dados realistas
- Resetar ambiente de desenvolvimento

```bash
# Criar estrutura do banco
npx prisma migrate dev

# Popular dados iniciais (executa prisma/seed.ts)
npx prisma db seed
```

#### Arquivo de Seed (prisma/seed.ts)

```typescript
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar cliente administrador
  const admin = await prisma.cliente.upsert({
    where: { email: 'admin@delivery.com' },
    update: {},
    create: {
      nome: 'Administrador',
      email: 'admin@delivery.com',
      senha: await hash('admin123', 10),
      telefone: '11999999999',
      endereco: 'Endereço Admin',
      isAdmin: true,
      pontosAcumulados: 0
    }
  });

  // Criar sabores
  const sabores = await prisma.sabor.createMany({
    data: [
      {
        nome: 'Mussarela',
        descricao: 'Molho de tomate, mussarela e orégano',
        preco: 35.00,
        tipo: 'TRADICIONAL',
        disponivel: true
      },
      {
        nome: 'Calabresa',
        descricao: 'Calabresa fatiada, cebola, molho e orégano',
        preco: 38.00,
        tipo: 'TRADICIONAL',
        disponivel: true
      },
      {
        nome: 'Quatro Queijos',
        descricao: 'Mussarela, provolone, gorgonzola e parmesão',
        preco: 48.00,
        tipo: 'PREMIUM',
        disponivel: true
      }
    ]
  });

  // Criar adicionais
  const adicionais = await prisma.adicional.createMany({
    data: [
      { nome: 'Queijo Extra', preco: 5.00, disponivel: true },
      { nome: 'Bacon', preco: 6.00, disponivel: true },
      { nome: 'Catupiry', preco: 7.00, disponivel: true }
    ]
  });

  console.log('✅ Seed concluído com sucesso!');
  console.log(`👤 Admin criado: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```
export class GetPedidosClienteUseCase {
  constructor(private prisma: PrismaClient) {}

  async execute(clienteId: bigint) {
    // Query type-safe com autocomplete
    const pedidos = await this.prisma.pedido.findMany({
      where: {
        clienteId: clienteId,
        status: {
          in: ['PENDENTE', 'EM_PREPARO', 'SAIU_ENTREGA']
        }
      },
      include: {
        itens: {
          include: {
            sabor: true,
            adicionais: {
              include: {
                adicional: true
              }
            }
          }
        },
        cupom: true
      },
      orderBy: {
        dataHora: 'desc'
      }
    });

    return pedidos;
  }
}
```Tabela de Junção (Many-to-Many)
// Relaciona ItemPedido com Adicional
model ItemPedidoAdicional {
  itemPedidoId BigInt
  itemPedido   ItemPedido @relation(fields: [itemPedidoId], references: [id], onDelete: Cascade)
## 10. Queries SQL Avançadas Implementadas

### Agregações e Estatísticas

```typescript
// Dashboard: estatísticas de vendas usando agregações
const stats = await prisma.pedido.aggregate({
  where: {
    status: 'CONCLUIDO',
    dataHora: {
      gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // últimos 30 dias
    }
  },
  _sum: {
    total: true           // SUM(total)
  },
  _avg: {
    total: true           // AVG(total)
  },
  _count: {
    id: true              // COUNT(id)
  }
});

// SQL Gerado:
// SELECT 
//   SUM(total) as _sum_total,
//   AVG(total) as _avg_total,
//   COUNT(id) as _count_id
// FROM Pedido
// WHERE status = 'CONCLUIDO'
//   AND dataHora >= '2025-11-02 00:00:00';
```

### GROUP BY e HAVING

```typescript
// Sabores mais vendidos (agrupamento)
const saboresMaisVendidos = await prisma.itemPedido.groupBy({
  by: ['saborId'],
  _sum: {
    quantidade: true
  },
  _count: {
    id: true
  },
  orderBy: {
    _sum: {
      quantidade: 'desc'
    }
  },
  take: 10
});

// SQL Gerado:
// SELECT 
//   saborId,
//   SUM(quantidade) as _sum_quantidade,
//   COUNT(id) as _count_id
// FROM ItemPedido
// GROUP BY saborId
// ORDER BY SUM(quantidade) DESC
// LIMIT 10;
```

### Subqueries e Queries Complexas

```typescript
// Clientes VIP (mais de 5 pedidos e valor total > 500)
const clientesVIP = await prisma.cliente.findMany({
  where: {
    pedidos: {
      some: {
        status: 'CONCLUIDO'
      }
    }
  },
  include: {
    _count: {
      select: { pedidos: true }
    },
    pedidos: {
      where: { status: 'CONCLUIDO' },
      select: { total: true }
    }
  }
});

// Filtrar no código (Prisma não suporta HAVING diretamente)
const vips = clientesVIP.filter(cliente => {
  const totalGasto = cliente.pedidos.reduce((sum, p) => sum + Number(p.total), 0);
  return cliente._count.pedidos >= 5 && totalGasto > 500;
});
```

### Window Functions (Raw SQL)

```typescript
// Ranking de clientes por valor gasto
const ranking = await prisma.$queryRaw`
  SELECT 
    c.id,
    c.nome,
    COUNT(p.id) as total_pedidos,
    SUM(p.total) as valor_total,
    RANK() OVER (ORDER BY SUM(p.total) DESC) as ranking
  FROM "Cliente" c
  INNER JOIN "Pedido" p ON p."clienteId" = c.id
  WHERE p.status = 'CONCLUIDO'
  GROUP BY c.id, c.nome
  ORDER BY valor_total DESC
  LIMIT 20;
`;
```

---

## 11. Otimizações e Índices

### Índices Criados no Schema

```prisma
model Cliente {
  // ...campos
  @@index([email])        // Índice simples para busca por email
}

model Pedido {
  // ...campos
  @@index([clienteId])              // FK index
  @@index([status, dataHora])       // Índice composto para filtros
}

model Sabor {
  // ...campos
  @@index([tipo, disponivel])       // Índice composto para listagem
}

model Cupom {
  // ...campos
  @@index([codigo])                 // Índice único para validação rápida
  @@index([clienteId])              // FK index
}
```

### Explicação: Por que Índices são Importantes?

**Índices** são estruturas de dados (geralmente B-Tree) que aceleram buscas no banco:
- Transformam `O(n)` em `O(log n)` para buscas
- Essenciais para **foreign keys** e **colunas frequentemente filtradas**
- Trade-off: aceleram leitura mas lentificam escrita
- Devem ser criados em colunas usadas em `WHERE`, `JOIN`, `ORDER BY`

**Exemplo de ganho de performance:**
- Busca sem índice: varredura completa da tabela (100ms em 10k registros)
- Busca com índice: acesso direto (< 1ms)

---

## 12. Conclusão

Este sistema atende a **todos os requisitos** especificados no roteiro:
  @@id([itemPedidoId, adicionalId])                        // Chave primária composta
  @@map("ItemPedidoAdicional")
}

// Tabela de Cupons de Desconto
// Relacionamento: N Cupons -> 1 Cliente (N:1)
// Relacionamento: 1 Cupom -> N Pedidos (1:N)
model Cupom {
  id        BigInt   @id @default(autoincrement())
  clienteId BigInt                                         // FK para Cliente
  cliente   Cliente  @relation(fields: [clienteId], references: [id], onDelete: Cascade)
  codigo    String   @unique                               // Código único do cupom
  desconto  Decimal  @db.Decimal(10, 2)
  validade  DateTime                                       // Data de expiração
  usado     Boolean  @default(false)
  pedidos   Pedido[]                                       // Relacionamento 1:N
  createdAt DateTime @default(now())
  
  @@index([codigo])                                        // Índice para busca rápida
  @@index([clienteId])                                     // Índice FK
  @@map("Cupom")
}HERE validade < CURRENT_DATE AND usado = false;
```

---

## 3. Estrutura do Banco de Dados

### Modelo de Dados Relacional (PostgreSQL)

O sistema utiliza **múltiplas tabelas** com relacionamentos complexos:

#### Tabelas Principais

**Cliente**
- id (BigInt, PK)
- nome (String)
- email (String, unique)
- telefone (String)
- senha (String, hashed)
- endereco (String)
- pontosAcumulados (Int)
- isAdmin (Boolean)

**Sabor**
- id (BigInt, PK)
- nome (String)
- descricao (String)
- preco (Decimal)
- tipo (Enum: TRADICIONAL, PREMIUM, ESPECIAL)
- disponivel (Boolean)
- imagemUrl (String, optional)

**Adicional**
- id (BigInt, PK)
- nome (String)
- preco (Decimal)
- disponivel (Boolean)

**Pedido**
- id (BigInt, PK)
- clienteId (BigInt, FK → Cliente)
- dataHora (DateTime)
- total (Decimal)
- status (Enum: PENDENTE, EM_PREPARO, SAIU_ENTREGA, CONCLUIDO, CANCELADO)
- cupomId (BigInt, FK → Cupom, optional)

**ItemPedido** (Tabela de Relacionamento)
- id (BigInt, PK)
- pedidoId (BigInt, FK → Pedido)
- saborId (BigInt, FK → Sabor)
- quantidade (Int)
- precoUnitario (Decimal)

**ItemPedidoAdicional** (Tabela Many-to-Many)
- itemPedidoId (BigInt, FK → ItemPedido)
- adicionalId (BigInt, FK → Adicional)

**Cupom**
- id (BigInt, PK)
- clienteId (BigInt, FK → Cliente)
- codigo (String, unique)
- desconto (Decimal)
- validade (DateTime)
- usado (Boolean)

### Schema Prisma

```prisma
// prisma/schema.prisma
model Cliente {
  id                BigInt   @id @default(autoincrement())
  nome              String
  email             String   @unique
  telefone          String
  senha             String
  endereco          String
  pontosAcumulados  Int      @default(0)
  isAdmin           Boolean  @default(false)
  pedidos           Pedido[]
  cupons            Cupom[]
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model Sabor {
  id          BigInt       @id @default(autoincrement())
  nome        String
  descricao   String?
  preco       Decimal      @db.Decimal(10, 2)
  tipo        TipoSabor
  disponivel  Boolean      @default(true)
  imagemUrl   String?
  itens       ItemPedido[]
}

model Pedido {
  id        BigInt       @id @default(autoincrement())
  clienteId BigInt
  cliente   Cliente      @relation(fields: [clienteId], references: [id])
  dataHora  DateTime     @default(now())
  total     Decimal      @db.Decimal(10, 2)
  status    StatusPedido @default(PENDENTE)
  cupomId   BigInt?
  cupom     Cupom?       @relation(fields: [cupomId], references: [id])
  itens     ItemPedido[]
}

enum TipoSabor {
  TRADICIONAL
  PREMIUM
  ESPECIAL
}

enum StatusPedido {
  PENDENTE
  EM_PREPARO
  SAIU_ENTREGA
  CONCLUIDO
  CANCELADO
}
```

---

## 4. Demonstração do Sistema

### Fluxo Principal de Uso

1. **Cadastro/Login de Cliente**
   - Endpoint: `/api/auth/register` e `/api/auth/login`
   - Validação de credenciais com JWT

2. **Navegação e Seleção de Produtos**
   - Listagem de sabores disponíveis
   - Filtros por categoria e preço
   - Visualização de detalhes e adicionais

3. **Montagem do Pedido**
   - Adição de itens ao carrinho
   - Seleção de sabores e adicionais
   - Cálculo automático de total

4. **Finalização do Pedido**
   - Aplicação de cupom (opcional)
   - Confirmação de endereço
   - Geração do pedido com transação

5. **Acompanhamento**
   - Visualização de status em tempo real
   - Histórico de pedidos
   - Acúmulo de pontos de fidelidade

### Endpoints da API

```
POST   /api/auth/register          - Cadastro de cliente
POST   /api/auth/login             - Login
GET    /api/sabores                - Listar sabores
GET    /api/adicionais             - Listar adicionais
POST   /api/pedidos                - Criar pedido (com transação)
GET    /api/pedidos/:id            - Detalhes do pedido (com joins)
PUT    /api/pedidos/:id/status     - Atualizar status (stored procedure)
POST   /api/clientes/cupom         - Gerar cupom (stored procedure)
GET    /api/dashboard/stats        - Estatísticas (consultas complexas)
```

---

## 5. Conexão com o Banco de Dados

### Arquivo de Configuração Prisma

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient({
  log: ['query', 'error', 'warn'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
```

### Variáveis de Ambiente (.env)

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/delivery_db"

# JWT Secret
JWT_SECRET="your-secret-key-here"
JWT_EXPIRES_IN="7d"

# App
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### Inicialização e Seeds

```bash
# Criar estrutura do banco
npx prisma migrate dev

# Popular dados iniciais
npx prisma db seed
```

---

## 6. Tecnologias Utilizadas

- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript
- **ORM:** Prisma
- **Banco de Dados:** PostgreSQL
- **Autenticação:** JWT (jsonwebtoken)
- **Criptografia:** bcryptjs
- **Validação:** Zod
- **UI:** React, Tailwind CSS
- **Arquitetura:** Clean Architecture (Domain, Application, Infrastructure)

---

## 7. Arquitetura do Sistema

### Camadas da Aplicação

```
src/
├── app/                    # Next.js App Router (Rotas e UI)
├── core/
│   ├── domain/            # Entidades e Regras de Negócio
│   └── application/       # Casos de Uso e Lógica de Aplicação
├── infrastructure/
│   ├── database/          # Repositórios Prisma
│   ├── http/              # Controllers e Middlewares
│   └── cryptography/      # Serviços de Hash/JWT
└── shared/                # Utilitários e Helpers
```

### Padrões de Projeto Implementados

- **Repository Pattern:** Abstração da camada de dados
- **Factory Pattern:** Criação de entidades complexas
- **Dependency Injection:** Inversão de dependências
- **Use Cases:** Separação de lógica de negócio
- **DTOs:** Objetos de transferência de dados

---

## 8. Instalação e Execução

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- pnpm (gerenciador de pacotes)

### Comandos

```bash
# Instalar dependências
pnpm install

# Configurar banco de dados
npx prisma generate
npx prisma migrate dev

# Popular dados iniciais
npx prisma db seed

# Iniciar servidor de desenvolvimento
pnpm dev

# Acessar em: http://localhost:3000
```

### Criar Administrador

```bash
# Via script
pnpm tsx scripts/create-admin.ts

# Ou via endpoint (ambiente dev)
curl -X POST http://localhost:3000/api/create-admin
```

---

## 9. Estrutura de Entrega

### Arquivos do Projeto

- **Código Fonte:** Todo o código está disponível no repositório
- **Banco de Dados:** Schema Prisma + Migrations
- **Documentação:** Pasta `/docs` com guias completos
- **Scripts:** Pasta `/scripts` com utilitários de setup

### Formato de Entrega

```
delivery.zip
├── src/                    # Código fonte completo
├── prisma/                 # Schema e migrations
├── docs/                   # Documentação
├── scripts/                # Scripts utilitários
├── package.json            # Dependências
├── .env.example            # Exemplo de variáveis
└── TRABALHO_BD2.md         # Este documento
```

---

## 10. Conclusão

Este sistema atende a **todos os requisitos** especificados no roteiro:

✅ **Requisitos Funcionais:** Sistema completo de delivery com múltiplas funcionalidades  
✅ **Transações:** Implementadas em operações compostas (criação de pedidos, aplicação de cupons)  
✅ **Consultas com Junções:** Múltiplas queries com INNER JOIN, LEFT JOIN e agregações  
✅ **Stored Procedures:** Procedures para geração de cupons e atualização de status  
✅ **Comandos SQL:** SELECT, INSERT, UPDATE, DELETE implementados  
✅ **Múltiplas Tabelas:** Banco de dados relacional com 7 tabelas principais  
✅ **Sistema Web:** Aplicação Next.js rodando em servidor local

O sistema está pronto para demonstração e pode ser executado localmente seguindo as instruções de instalação.

---

**Data de Elaboração:** 02/12/2025  
**Disciplina:** Banco de Dados II  
**Projeto:** Sistema de Delivery de Pizzaria
