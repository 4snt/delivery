# Correção da Integração com SQLite

## Problemas Encontrados e Soluções

### 1. **Relacionamento Many-to-Many Implícito**

**Problema:** O Prisma estava usando relacionamentos many-to-many implícitos que não funcionam corretamente com SQLite.

```prisma
// ❌ ANTES (Implícito - não funciona bem com SQLite)
model Pedido {
  sabores     Sabor[]
  adicionais  Adicional[] @relation("PedidoAdicionais")
}
```

**Solução:** Implementar tabelas de junção explícitas (relacionamento many-to-many explícito).

```prisma
// ✅ DEPOIS (Explícito - funciona perfeitamente com SQLite)
model Pedido {
  sabores     PedidoSabor[]
  adicionais  PedidoAdicional[]
}

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

### 2. **Atualização das Rotas da API**

**Arquivo:** `src/app/api/pedidos/route.ts`

**GET - Buscar pedidos:**
```typescript
// ✅ Incluir os relacionamentos aninhados
const pedidos = await prisma.pedido.findMany({
  include: {
    cliente: true,
    sabores: {
      include: {
        sabor: true,
      },
    },
    adicionais: {
      include: {
        adicional: true,
      },
    },
  },
});
```

**POST - Criar pedido:**
```typescript
// ✅ Usar 'create' em vez de 'connect' para tabelas de junção
const novoPedido = await prisma.pedido.create({
  data: {
    cliente: { connect: { id: clienteId } },
    sabores: {
      create: sabores.map((s: { id: number }) => ({
        sabor: { connect: { id: s.id } }
      }))
    },
    adicionais: {
      create: adicionais.map((a: { id: number }) => ({
        adicional: { connect: { id: a.id } }
      }))
    },
    tamanho,
    valorTotal,
    formaPagamento,
    enderecoEntrega,
  },
});
```

## Comandos Executados

```bash
# 1. Gerar o Prisma Client
npx prisma generate

# 2. Criar migração com o novo schema
npx prisma migrate dev --name fix-many-to-many

# 3. Popular o banco de dados
npx prisma db seed

# 4. Verificar a sincronização
npx prisma db push
```

## Verificação da Integração

✅ **Banco de dados:** SQLite (`prisma/dev.db`)
✅ **Tabelas criadas:** Cliente, Sabor, Adicional, Pedido, PedidoSabor, PedidoAdicional
✅ **Relacionamentos:** Funcionando corretamente
✅ **CRUD de Pedidos:** Totalmente funcional

## Estrutura das Tabelas

```
Cliente (1) ─────< Pedido (N)
Sabor (N) ───< PedidoSabor >─── (N) Pedido
Adicional (N) ─< PedidoAdicional >─ (N) Pedido
```

## Testes Realizados

1. ✓ Conexão com o banco de dados
2. ✓ Criação de cliente
3. ✓ Busca de sabores e adicionais
4. ✓ Criação de pedido com relacionamentos
5. ✓ Busca de pedidos com includes

## Próximos Passos

Para executar os testes de integração:

```bash
# Iniciar o servidor de desenvolvimento
npm run dev

# Em outro terminal, executar os testes
npm test
```

## Observações Importantes

- SQLite **não suporta bem** relacionamentos many-to-many implícitos do Prisma
- Sempre use **tabelas de junção explícitas** para relacionamentos N:N
- Use `onDelete: Cascade` para garantir integridade referencial
- Regenere o Prisma Client após mudanças no schema: `npx prisma generate`
