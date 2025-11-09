"use client";

import { useOrder } from '@/contexts';
import { Button } from '@/components/ui';
import { formatCurrency } from '@/utils';
import { useRouter } from 'next/navigation';

export function CartSummary() {
  const { cart, getTotalItems, getTotalPrice, removeFromCart } = useOrder();
  const router = useRouter();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600 mb-4">🛒 Seu carrinho está vazio</p>
        <Button onClick={() => router.push('/ui/pedido/tamanho')}>
          Começar Pedido
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Resumo do Pedido</h2>
      
      <div className="space-y-3 mb-4">
        {cart.map((item, index) => (
          <div key={item.id} className="flex justify-between items-start border-b pb-3">
            <div className="flex-1">
              <p className="font-medium">{item.size}</p>
              <p className="text-sm text-gray-600">
                {item.flavors.map(f => f.name).join(', ')}
              </p>
              {item.additionals.length > 0 && (
                <p className="text-sm text-gray-500">
                  + {item.additionals.map(a => a.name).join(', ')}
                </p>
              )}
              <p className="text-sm text-gray-700 mt-1">
                Qtd: {item.quantity} × {formatCurrency(item.price)}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <p className="font-semibold">
                {formatCurrency(item.price * item.quantity)}
              </p>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 text-sm hover:text-red-700"
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Total de itens:</span>
          <span className="font-medium">{totalItems}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-2xl font-bold text-purple-600">
            {formatCurrency(totalPrice)}
          </span>
        </div>
        
        <Button 
          className="w-full"
          onClick={() => router.push('/ui/pedido/pagamento')}
        >
          Finalizar Pedido
        </Button>
      </div>
    </div>
  );
}
