// API Base URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

// Order Status
export const ORDER_STATUS = {
  PENDING: 'Pendente',
  PREPARING: 'Em preparo',
  OUT_FOR_DELIVERY: 'Saiu para a entrega',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
} as const;

// Pizza Sizes
export const PIZZA_SIZES = {
  SMALL: { label: 'Pequeno', value: 'pequeno', price: 25, description: '300ml' },
  MEDIUM: { label: 'Médio', value: 'medio', price: 35, description: '500ml' },
  LARGE: { label: 'Grande', value: 'grande', price: 45, description: '700ml' },
} as const;

export const PIZZA_SIZES_ARRAY = [
  { label: 'Pequeno', value: 'pequeno', price: 25, description: '300ml' },
  { label: 'Médio', value: 'medio', price: 35, description: '500ml' },
  { label: 'Grande', value: 'grande', price: 45, description: '700ml' },
];

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: 'Dinheiro',
  DEBIT: 'Débito',
  CREDIT: 'Crédito',
  PIX: 'PIX',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/ui/cliente/cadastro',
  ORDER: {
    SIZE: '/ui/pedido/tamanho',
    FLAVORS: '/ui/pedido/sabores',
    ADDITIONALS: '/ui/pedido/adicionais',
    ADDRESS: '/ui/pedido/endereco',
    PAYMENT: '/ui/pedido/pagamento',
    CART: '/ui/pedido/carrinho',
  },
  DASHBOARD: {
    USER: '/protegido/dashboard',
    ADMIN: '/dashboard',
  },
} as const;

// Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: 'Este campo é obrigatório',
  INVALID_EMAIL: 'Email inválido',
  PASSWORD_MIN_LENGTH: 'Senha deve ter no mínimo 6 caracteres',
  PASSWORD_MISMATCH: 'As senhas não coincidem',
} as const;
