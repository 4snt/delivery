"use client";

import { PageLayout } from '@/components/layout';
import { Card, Button } from '@/components/ui';
import { useOrder } from '@/contexts';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/utils';
import { PIZZA_SIZES_ARRAY } from '@/constants';

export default function TamanhoPageRefactored() {
  const { setSelectedSize, addToCart } = useOrder();
  const router = useRouter();

  const handleSelectSize = (size: string, price: number) => {
    setSelectedSize(size);
    router.push('/ui/pedido/sabores');
  };

  return (
    <PageLayout 
      title="Escolha o Tamanho"
      subtitle="Selecione o tamanho do seu sorvete"
      containerSize="md"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PIZZA_SIZES_ARRAY.map((size) => (
          <Card 
            key={size.value}
            hoverable
            className="text-center"
          >
            <div className="mb-4">
              <div className="text-4xl mb-2">{size.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {size.label}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{size.description}</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(size.price)}
              </p>
            </div>
            
            <Button
              onClick={() => handleSelectSize(size.label, size.price)}
              className="w-full"
            >
              Selecionar
            </Button>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button 
          variant="secondary" 
          onClick={() => router.push('/')}
        >
          ← Voltar
        </Button>
      </div>
    </PageLayout>
  );
}
