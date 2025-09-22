"use client";
import { usePedido } from "../PedidoContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Sabor {
  id: number;
  nome: string;
  imagem?: string;
}

export default function SaboresPage() {
  const { pedido, setPedido } = usePedido();
  const router = useRouter();
  const [sabores, setSabores] = useState<Sabor[]>([]);
  const [selecionados, setSelecionados] = useState<string[]>(pedido.sabores || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/sabores")
      .then(res => {
        if (!res.ok) throw new Error('Erro ao carregar sabores');
        return res.json();
      })
      .then(data => {
        setSabores(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleToggle = (sabor: string) => {
    setSelecionados((prev) =>
      prev.includes(sabor) ? prev.filter((s) => s !== sabor) : [...prev, sabor]
    );
  };

  const handleAvancar = () => {
    if (selecionados.length === 0) return;
    setPedido((prev) => ({ ...prev, sabores: selecionados }));
    router.push("/ui/pedido/adicionais");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-green-100 p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-6 text-purple-700">Carregando sabores...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-green-100 p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-6 text-purple-700">Erro ao carregar sabores</h1>
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-green-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-purple-700">
          Selecione os sabores do sorvete
        </h1>
        
        {sabores.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-500 text-xl">Nenhum sabor disponível</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {sabores.map((sabor) => (
              <div
                key={sabor.id}
                className={`relative bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  selecionados.includes(sabor.nome) 
                    ? 'ring-4 ring-purple-500 shadow-2xl' 
                    : 'hover:shadow-xl'
                }`}
                onClick={() => handleToggle(sabor.nome)}
              >
                {/* Checkbox overlay */}
                <div className="absolute top-2 right-2 z-10">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selecionados.includes(sabor.nome)
                      ? 'bg-purple-500 border-purple-500'
                      : 'bg-white border-gray-300'
                  }`}>
                    {selecionados.includes(sabor.nome) && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Imagem do sabor */}
                <div className="aspect-square bg-gradient-to-br from-purple-100 to-green-100 flex items-center justify-center">
                  {sabor.imagem ? (
                    <img
                      src={sabor.imagem}
                      alt={sabor.nome}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-purple-300 to-green-300 rounded-full flex items-center justify-center">
                        <span className="text-2xl">🍦</span>
                      </div>
                      <p className="text-sm text-gray-600">Imagem em breve</p>
                    </div>
                  )}
                </div>

                {/* Nome do sabor */}
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-lg text-purple-700">
                    {sabor.nome}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Botão avançar */}
        <div className="text-center">
          <button
            onClick={handleAvancar}
            disabled={selecionados.length === 0}
            style={{ 
              background: selecionados.length === 0 ? "#e9d5ff" : "#8b5cf6", 
              color: selecionados.length === 0 ? "#888" : "#fff" 
            }}
            className="px-8 py-4 rounded-lg text-xl font-semibold shadow-lg transition-all duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {selecionados.length > 0 
              ? `Avançar (${selecionados.length} sabor${selecionados.length > 1 ? 'es' : ''} selecionado${selecionados.length > 1 ? 's' : ''})`
              : 'Selecione pelo menos um sabor'
            }
          </button>
        </div>
      </div>
    </div>
  );
}
