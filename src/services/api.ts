import { fetchApi } from '@/utils';
import { Customer, Order, Flavor, Additional, ApiResponse } from '@/types';

// Clientes
export const customerService = {
  getAll: () => fetchApi<Customer[]>('/api/clientes'),
  
  getById: (id: number) => fetchApi<Customer>(`/api/clientes?id=${id}`),
  
  create: (data: { name: string; email: string; password: string }) =>
    fetchApi<Customer>('/api/clientes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: number, data: Partial<Customer>) =>
    fetchApi<Customer>(`/api/clientes?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id: number) =>
    fetchApi<void>(`/api/clientes?id=${id}`, {
      method: 'DELETE',
    }),
};

// Pedidos
export const orderService = {
  getAll: () => fetchApi<Order[]>('/api/pedidos'),
  
  getById: (id: number) => fetchApi<Order>(`/api/pedidos?id=${id}`),
  
  getByCustomer: (customerId: number) =>
    fetchApi<Order[]>(`/api/pedidos?customerId=${customerId}`),
  
  create: (data: Omit<Order, 'id' | 'createdAt'>) =>
    fetchApi<Order>('/api/pedidos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  updateStatus: (id: number, status: string) =>
    fetchApi<Order>(`/api/pedidos?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
  
  delete: (id: number) =>
    fetchApi<void>(`/api/pedidos?id=${id}`, {
      method: 'DELETE',
    }),
};

// Sabores
export const flavorService = {
  getAll: () => fetchApi<Flavor[]>('/api/sabores'),
  
  getById: (id: number) => fetchApi<Flavor>(`/api/sabores?id=${id}`),
  
  create: (data: Omit<Flavor, 'id'>) =>
    fetchApi<Flavor>('/api/sabores', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: number, data: Partial<Flavor>) =>
    fetchApi<Flavor>(`/api/sabores?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id: number) =>
    fetchApi<void>(`/api/sabores?id=${id}`, {
      method: 'DELETE',
    }),
};

// Adicionais
export const additionalService = {
  getAll: () => fetchApi<Additional[]>('/api/adicionais'),
  
  getById: (id: number) => fetchApi<Additional>(`/api/adicionais?id=${id}`),
  
  create: (data: Omit<Additional, 'id'>) =>
    fetchApi<Additional>('/api/adicionais', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: number, data: Partial<Additional>) =>
    fetchApi<Additional>(`/api/adicionais?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id: number) =>
    fetchApi<void>(`/api/adicionais?id=${id}`, {
      method: 'DELETE',
    }),
};

// Auth
export const authService = {
  login: (credentials: { email: string; password: string }) =>
    fetchApi<{ token: string; user: Customer }>('/api/jwt/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  
  register: (data: { name: string; email: string; password: string }) =>
    fetchApi<Customer>('/api/clientes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
