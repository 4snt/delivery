# 📁 Estrutura do Frontend - Delivery App

## 🎯 Visão Geral

Este documento descreve a nova estrutura organizada do frontend da aplicação de delivery. A refatoração foi feita para seguir as melhores práticas do Next.js e React, com código mais limpo, reutilizável e manutenível.

## 📂 Estrutura de Pastas

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes de UI básicos
│   ├── layout/         # Componentes de layout
│   ├── forms/          # Componentes de formulários
│   ├── shared/         # Componentes compartilhados complexos
│   ├── admin/          # Componentes específicos do admin
│   └── client/         # Componentes específicos do cliente
├── contexts/           # Contexts do React (estado global)
├── hooks/              # Custom hooks
├── services/           # Camada de serviços (API calls)
├── utils/              # Funções utilitárias
├── types/              # Definições de tipos TypeScript
├── constants/          # Constantes da aplicação
└── app/                # Rotas Next.js App Router
```

## 🧩 Componentes

### UI Components (`src/components/ui/`)

Componentes básicos e reutilizáveis de interface:

- **Button** - Botão com variantes (primary, secondary, danger, ghost)
- **Input** - Campo de entrada com label e erro
- **Select** - Campo de seleção
- **Textarea** - Área de texto
- **Card** - Card com Header, Title, Content e Footer
- **Badge** - Badge de status com variantes coloridas
- **Loading** - Spinner de carregamento

**Exemplo de uso:**
```tsx
import { Button, Input, Card } from '@/components/ui';

<Card>
  <CardHeader>
    <CardTitle>Login</CardTitle>
  </CardHeader>
  <CardContent>
    <Input label="Email" type="email" />
    <Button variant="primary">Entrar</Button>
  </CardContent>
</Card>
```

### Layout Components (`src/components/layout/`)

Componentes para estruturar páginas:

- **PageLayout** - Layout completo de página com título
- **Container** - Container responsivo com tamanhos (sm, md, lg, xl)
- **Section** - Seção de conteúdo com título e subtítulo

**Exemplo de uso:**
```tsx
import { PageLayout, Section } from '@/components/layout';

<PageLayout title="Meus Pedidos" subtitle="Veja seus pedidos recentes">
  <Section title="Pedidos Ativos">
    {/* conteúdo */}
  </Section>
</PageLayout>
```

### Shared Components (`src/components/shared/`)

Componentes compartilhados mais complexos:

- **CartSummary** - Resumo do carrinho com total
- **OrderCard** - Card de pedido com informações detalhadas
- **Modal** - Modal reutilizável

## 🎣 Hooks Customizados

### `useFetch`
Hook para buscar dados da API com loading e error states.

```tsx
import { useFetch } from '@/hooks';

const { data, loading, error, refetch } = useFetch<Flavor[]>('/api/sabores');
```

### `useLocalStorage`
Hook type-safe para localStorage com suporte SSR.

```tsx
import { useLocalStorage } from '@/hooks';

const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
```

## 🌐 Context API

### OrderContext
Gerencia todo o estado do pedido (carrinho, tamanho, sabores, adicionais, endereço, pagamento).

```tsx
import { useOrder } from '@/contexts';

const { 
  cart, 
  addToCart, 
  removeFromCart, 
  getTotalPrice,
  selectedSize,
  setSelectedSize 
} = useOrder();
```

**Funcionalidades:**
- ✅ Gerenciamento de carrinho
- ✅ Persistência em localStorage
- ✅ Cálculo automático de totais
- ✅ Estado de tamanho, sabores e adicionais
- ✅ Endereço e forma de pagamento

## 🔧 Services (API Layer)

Camada organizada para chamadas de API:

```tsx
import { customerService, orderService, flavorService } from '@/services';

// Listar clientes
const customers = await customerService.getAll();

// Criar pedido
const order = await orderService.create({
  customerId: 1,
  flavorIds: [1, 2],
  size: 'Médio',
  totalValue: 35,
  // ...
});
```

**Serviços disponíveis:**
- `customerService` - CRUD de clientes
- `orderService` - CRUD de pedidos
- `flavorService` - CRUD de sabores
- `additionalService` - CRUD de adicionais
- `authService` - Login e registro

## 🛠️ Utilities

Funções utilitárias em `src/utils/`:

```tsx
import { formatCurrency, formatDate, isValidEmail, cn } from '@/utils';

formatCurrency(2500); // "R$ 25,00"
formatDate(new Date()); // "20/12/2024 15:30"
isValidEmail('test@example.com'); // true
cn('base-class', condition && 'conditional-class'); // combina classes
```

**Funções disponíveis:**
- `fetchApi` - Wrapper para fetch com tratamento de erro
- `formatCurrency` - Formata valores monetários
- `formatDate` - Formata datas
- `isValidEmail` - Valida emails
- `isValidCPF` - Valida CPF
- `getOrderStatusColor` - Retorna cor do status do pedido
- `storage` - Helper para localStorage
- `debounce` - Debounce de funções
- `cn` - Combina classes CSS (clsx)

## 📝 Types

Tipos TypeScript centralizados em `src/types/`:

```tsx
interface Customer {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: Date;
}

interface Order {
  id: number;
  customerId: number;
  flavorIds: number[];
  size: string;
  totalValue: number;
  status: string;
  // ...
}
```

## 🎨 Constants

Constantes da aplicação em `src/constants/`:

```tsx
import { ORDER_STATUS, PAYMENT_METHODS, ROUTES, VALIDATION_MESSAGES } from '@/constants';

console.log(ORDER_STATUS.PENDING); // "Pendente"
console.log(PAYMENT_METHODS.PIX); // "PIX"
console.log(ROUTES.ORDERS); // "/ui/pedidos"
```

## 🔄 Exemplo Completo de Refatoração

### ❌ Antes (Código antigo)
```tsx
export default function TamanhoPage() {
  const [selected, setSelected] = useState('');
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-green-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Selecione o tamanho</h1>
        {/* código duplicado, estilos inline, sem tipagem */}
      </div>
    </div>
  );
}
```

### ✅ Depois (Código refatorado)
```tsx
import { PageLayout } from '@/components/layout';
import { Card, Button } from '@/components/ui';
import { useOrder } from '@/contexts';
import { PIZZA_SIZES_ARRAY } from '@/constants';

export default function TamanhoPage() {
  const { setSelectedSize } = useOrder();
  const router = useRouter();

  return (
    <PageLayout title="Escolha o Tamanho" containerSize="md">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PIZZA_SIZES_ARRAY.map(size => (
          <Card key={size.value} hoverable>
            <h3>{size.label}</h3>
            <p>{formatCurrency(size.price)}</p>
            <Button onClick={() => handleSelect(size)}>
              Selecionar
            </Button>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
}
```

## 🚀 Benefícios da Nova Estrutura

✅ **Reutilização de código** - Componentes usados em várias páginas  
✅ **Tipagem forte** - TypeScript em toda a aplicação  
✅ **Manutenibilidade** - Código organizado e fácil de encontrar  
✅ **Performance** - Hooks otimizados e memoização  
✅ **Testabilidade** - Componentes isolados e testáveis  
✅ **Escalabilidade** - Estrutura preparada para crescer  
✅ **DX (Developer Experience)** - Imports limpos e autocompletar  

## 📋 Próximos Passos

1. ✅ Estrutura de pastas criada
2. ✅ Componentes UI básicos
3. ✅ Layout components
4. ✅ OrderContext implementado
5. ✅ Services layer criada
6. 🔄 Refatorar páginas existentes
7. ⏳ Criar componentes de formulários
8. ⏳ Adicionar testes unitários
9. ⏳ Documentar componentes com Storybook

## 🤝 Convenções

- Use `"use client"` apenas em componentes que usam hooks de estado
- Prefira `export function` ao invés de `export default` para components
- Sempre tipagem TypeScript (sem `any`)
- Componentes em PascalCase, arquivos em kebab-case
- Um componente por arquivo
- Exports nomeados em `index.ts` de cada pasta

---

**Última atualização:** Dezembro 2024
