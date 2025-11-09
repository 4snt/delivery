"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { CartItem, Flavor, Additional } from '@/types';

interface OrderContextData {
  // Carrinho
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItem: (itemId: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  
  // Totais
  getTotalItems: () => number;
  getTotalPrice: () => number;
  
  // Tamanho
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  
  // Sabores
  selectedFlavors: Flavor[];
  setSelectedFlavors: (flavors: Flavor[]) => void;
  
  // Adicionais
  selectedAdditionals: Additional[];
  setSelectedAdditionals: (additionals: Additional[]) => void;
  
  // Endereço
  deliveryAddress: string;
  setDeliveryAddress: (address: string) => void;
  
  // Pagamento
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

const OrderContext = createContext<OrderContextData | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedFlavors, setSelectedFlavors] = useState<Flavor[]>([]);
  const [selectedAdditionals, setSelectedAdditionals] = useState<Additional[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  // Carregar do localStorage ao montar
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      const savedSize = localStorage.getItem('selectedSize');
      const savedFlavors = localStorage.getItem('selectedFlavors');
      const savedAdditionals = localStorage.getItem('selectedAdditionals');
      const savedAddress = localStorage.getItem('deliveryAddress');
      const savedPayment = localStorage.getItem('paymentMethod');

      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedSize) setSelectedSize(savedSize);
      if (savedFlavors) setSelectedFlavors(JSON.parse(savedFlavors));
      if (savedAdditionals) setSelectedAdditionals(JSON.parse(savedAdditionals));
      if (savedAddress) setDeliveryAddress(savedAddress);
      if (savedPayment) setPaymentMethod(savedPayment);
    } catch (error) {
      console.error('Erro ao carregar dados do localStorage:', error);
    }
  }, []);

  // Salvar no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('selectedSize', selectedSize);
  }, [selectedSize]);

  useEffect(() => {
    localStorage.setItem('selectedFlavors', JSON.stringify(selectedFlavors));
  }, [selectedFlavors]);

  useEffect(() => {
    localStorage.setItem('selectedAdditionals', JSON.stringify(selectedAdditionals));
  }, [selectedAdditionals]);

  useEffect(() => {
    localStorage.setItem('deliveryAddress', deliveryAddress);
  }, [deliveryAddress]);

  useEffect(() => {
    localStorage.setItem('paymentMethod', paymentMethod);
  }, [paymentMethod]);

  const addToCart = useCallback((item: Omit<CartItem, 'id'>) => {
    const newItem: CartItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
    };
    setCart(prev => [...prev, newItem]);
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const updateCartItem = useCallback((itemId: string, updates: Partial<CartItem>) => {
    setCart(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setSelectedSize('');
    setSelectedFlavors([]);
    setSelectedAdditionals([]);
    setDeliveryAddress('');
    setPaymentMethod('');
    
    // Limpar localStorage
    localStorage.removeItem('cart');
    localStorage.removeItem('selectedSize');
    localStorage.removeItem('selectedFlavors');
    localStorage.removeItem('selectedAdditionals');
    localStorage.removeItem('deliveryAddress');
    localStorage.removeItem('paymentMethod');
  }, []);

  const getTotalItems = useCallback(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const getTotalPrice = useCallback(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  return (
    <OrderContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        getTotalItems,
        getTotalPrice,
        selectedSize,
        setSelectedSize,
        selectedFlavors,
        setSelectedFlavors,
        selectedAdditionals,
        setSelectedAdditionals,
        deliveryAddress,
        setDeliveryAddress,
        paymentMethod,
        setPaymentMethod,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder deve ser usado dentro de OrderProvider');
  }
  return context;
}
