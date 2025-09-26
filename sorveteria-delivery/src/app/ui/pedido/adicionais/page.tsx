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
  // Selecionados: adicionais do último pote (em montagem)
  const [selecionados, setSelecionados] = useState<string[]>(pedido.potes.length > 0 && pedido.potes[pedido.potes.length - 1].adicionais ? pedido.potes[pedido.potes.length - 1].adicionais! : []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
      potes[potes.length - 1] = { ...potes[potes.length - 1], adicionais: selecionados };
      return { ...prev, potes };
    });
    router.push("/ui/pedido/carrinho");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-green-100 p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-6 text-purple-700">Carregando adicionais...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-green-100 p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-6 text-purple-700">Erro ao carregar adicionais</h1>
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-green-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6 text-purple-700">Selecione os adicionais</h1>
        <div className="flex flex-col gap-3 w-full mb-6">
          {adicionais.length === 0 ? (
            <p className="text-gray-500 text-center">Nenhum adicional disponível</p>
          ) : (
            adicionais.map((adicional) => (
              <label key={adicional.id} className="flex items-center gap-3 text-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={selecionados.includes(adicional.nome)}
                  onChange={() => handleToggle(adicional.nome)}
                  style={{ accentColor: "#8b5cf6" }}
                  className="w-5 h-5"
                />
                <span style={{ background: "#10b981", color: "#fff", borderRadius: 8, padding: "6px 16px", fontWeight: 500, minWidth: 100, display: "inline-block" }}>{adicional.nome}</span>
              </label>
            ))
          )}
        </div>
        <button
          onClick={handleAvancar}
          style={{ background: "#8b5cf6", color: "#fff" }}
          className="w-full py-3 rounded-lg text-lg font-semibold shadow transition hover:brightness-110"
        >
          Avançar
        </button>
      </div>
    </div>
  );
}
