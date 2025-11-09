// API Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Customer Types
export interface Customer {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: Date;
}

// Order Types
export interface Order {
  id: number;
  customerId: number;
  flavorIds: number[];
  additionalIds: number[];
  size: string;
  totalValue: number;
  paymentMethod: string;
  deliveryAddress: string;
  status: string;
  createdAt: Date;
}

// Flavor Types
export interface Flavor {
  id: number;
  name: string;
  image?: string;
}

// Additional Types
export interface Additional {
  id: number;
  name: string;
}

// Cart Types
export interface CartItem {
  id: string;
  size: string;
  price: number;
  quantity: number;
  flavors: Flavor[];
  additionals: Additional[];
}

// Order Context Types
export interface OrderContextData {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  totalValue: number;
  selectedSize: string | null;
  setSelectedSize: (size: string) => void;
  selectedFlavors: Flavor[];
  setSelectedFlavors: (flavors: Flavor[]) => void;
  selectedAdditionals: Additional[];
  setSelectedAdditionals: (additionals: Additional[]) => void;
  deliveryAddress: string;
  setDeliveryAddress: (address: string) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}
