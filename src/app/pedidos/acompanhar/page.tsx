"use client";

import { useState } from "react";

type Pedido = {
  id: number;
  status: string;
  enderecoEntrega: string;
  createdAt?: string;
  formaPagamento: string;
  valorTotal: number;
  sabores?: { sabor: { nome: string } }[];
  adicionais?: { adicional: { nome: string } }[];
};

export default function AcompanharPedidoPage() {
  const [email, setEmail] = useState("");
  const [pedidoId, setPedidoId] = useState("");
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatData = (dateStr?: string) => {
    if (!dateStr) return "-";
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? "-" : parsed.toLocaleString();
  };

  const buscar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (email) params.append("email", email);
      if (pedidoId) params.append("id", pedidoId);
      const res = await fetch(`/api/pedidos?${params.toString()}`);
      if (!res.ok) throw new Error("Não foi possível localizar pedidos");
      const data = await res.json();
      let filtrados = data as Pedido[];
      if (pedidoId) {
        filtrados = filtrados.filter((p) => String(p.id) === pedidoId);
      }
      setPedidos(filtrados);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-3xl p-8 border border-purple-100">
        <h1 className="text-3xl font-bold text-purple-800 mb-4">Acompanhar Pedido</h1>
        <p className="text-gray-600 mb-6">Informe seu e-mail e, opcionalmente, o número do pedido para ver o status.</p>

        <form onSubmit={buscar} className="grid gap-4 mb-6">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu e-mail cadastrado"
            className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="text"
            value={pedidoId}
            onChange={(e) => setPedidoId(e.target.value)}
            placeholder="Número do pedido (opcional)"
            className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl px-6 py-3 hover:brightness-110 transition"
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </form>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <div className="space-y-4">
          {pedidos.map((p) => (
            <div key={p.id} className="border border-gray-100 rounded-2xl p-4 shadow-sm bg-purple-50/40">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                  <p className="text-xs text-gray-500">Pedido #{p.id}</p>
                  <p className="text-lg font-semibold text-gray-800">{p.status}</p>
                  <p className="text-sm text-gray-600">{formatData(p.createdAt)}</p>
                </div>
                <span className="px-3 py-1 bg-white rounded-full text-sm text-purple-700 border border-purple-200">
                  {p.formaPagamento}
                </span>
              </div>
              <div className="mt-3 text-sm text-gray-700 space-y-1">
                <p><span className="font-semibold">Endereço:</span> {p.enderecoEntrega}</p>
                <p><span className="font-semibold">Sabores:</span> {p.sabores?.map((s) => s.sabor.nome).join(", ") || "-"}</p>
                <p><span className="font-semibold">Adicionais:</span> {p.adicionais?.map((a) => a.adicional.nome).join(", ") || "-"}</p>
                <p className="font-semibold text-green-700">Total: R$ {p.valorTotal?.toFixed(2) || "0,00"}</p>
              </div>
            </div>
          ))}
          {pedidos.length === 0 && !loading && !error && (
            <p className="text-gray-500 text-sm">Nenhum pedido encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}
