"use client";
import { usePedido } from "../PedidoContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Adicional {
  id: number;
  nome: string;
}

export default function AdicionaisPage() {
  const { pedido, setPedido } = usePedido();
  const router = useRouter();
  const [adicionais, setAdicionais] = useState<Adicional[]>([]);
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Carregar adicionais já selecionados do último pote
    if (pedido.potes.length > 0) {
      const ultimoPote = pedido.potes[pedido.potes.length - 1];
      if (ultimoPote.adicionais) {
        setSelecionados(ultimoPote.adicionais);
      }
    }

    // Buscar adicionais da API
    fetch("/api/adicionais")
      .then(res => {
        if (!res.ok) throw new Error('Erro ao carregar adicionais');
        return res.json();
      })
      .then(data => {
        setAdicionais(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleToggle = (adicional: string) => {
    setSelecionados((prev) =>
      prev.includes(adicional) ? prev.filter((a) => a !== adicional) : [...prev, adicional]
    );
  };

  const handleAvancar = () => {
    setPedido(prev => {
      const potes = [...prev.potes];
      if (potes.length > 0) {
        potes[potes.length - 1] = { ...potes[potes.length - 1], adicionais: selecionados };
      }
      return { ...prev, potes };
    });
    router.push("/ui/pedido/carrinho");
  };

  const handlePular = () => {
    setPedido(prev => {
      const potes = [...prev.potes];
      if (potes.length > 0) {
        potes[potes.length - 1] = { ...potes[potes.length - 1], adicionais: [] };
      }
      return { ...prev, potes };
    });
    router.push("/ui/pedido/carrinho");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mb-4"></div>
            <h1 className="text-2xl font-bold text-purple-700">Carregando adicionais...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-2xl font-bold mb-4 text-red-600">⚠️ Erro ao carregar adicionais</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-purple-700 mb-2">
              ✨ Adicionais Especiais
            </h1>
            <p className="text-gray-600">
              Deixe seu sorvete ainda mais gostoso! (Opcional)
            </p>
          </div>

          {adicionais.length === 0 ? (
            <p className="text-gray-500 text-center text-lg py-8">
              Nenhum adicional disponível no momento
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {adicionais.map((adicional) => (
                <button
                  key={adicional.id}
                  onClick={() => handleToggle(adicional.nome)}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105
                    ${selecionados.includes(adicional.nome)
                      ? 'border-purple-600 bg-purple-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                      ${selecionados.includes(adicional.nome)
                        ? 'bg-purple-600 border-purple-600'
                        : 'border-gray-300'
                      }
                    `}>
                      {selecionados.includes(adicional.nome) && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className={`font-semibold text-lg ${
                      selecionados.includes(adicional.nome) ? 'text-purple-700' : 'text-gray-700'
                    }`}>
                      {adicional.nome}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handlePular}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-4 rounded-xl text-lg font-bold transition-all shadow-md"
            >
              Pular (Sem adicionais)
            </button>
            <button
              onClick={handleAvancar}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-xl text-lg font-bold transition-all shadow-lg"
            >
              {selecionados.length > 0 
                ? `Continuar (${selecionados.length} selecionado${selecionados.length > 1 ? 's' : ''})`
                : 'Continuar'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
