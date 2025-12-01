"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Pedido = {
  id: number;
  status: string;
  enderecoEntrega: string;
  createdAt?: string;
  formaPagamento: string;
  valorTotal: number;
  tamanho?: string;
  cupomCodigo?: string | null;
  descontoAplicado?: number;
  sabores?: { sabor: { nome: string; id: number } }[];
  adicionais?: { adicional: { nome: string; id: number } }[];
};

type Favorito = {
  id: number;
  nome: string;
  tamanho: string;
  preco: number;
  sabores: { sabor: { nome: string; id: number } }[];
  adicionais: { adicional: { nome: string; id: number } }[];
};

export default function AcompanharPedidoPage() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [pedidoId, setPedidoId] = useState("");
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clienteId = (session?.user as any)?.id;

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

  const carregarFavoritos = async () => {
    if (!clienteId) return;
    try {
      const res = await fetch(`/api/v1/favorites?clienteId=${clienteId}`);
      if (!res.ok) return;
      const data = await res.json();
      setFavoritos(data);
    } catch (err) {
      console.error("Erro ao carregar favoritos", err);
    }
  };

  const salvarFavorito = async (pedido: Pedido) => {
    if (!clienteId) {
      setError("Faça login para salvar favoritos");
      return;
    }
    try {
      const body = {
        clienteId,
        nome: `Pote #${pedido.id}`,
        tamanho: pedido.tamanho || "personalizado",
        preco: pedido.valorTotal || 0,
        sabores: (pedido.sabores || []).map((s) => ({ id: s.sabor.id })),
        adicionais: (pedido.adicionais || []).map((a) => ({ id: a.adicional.id })),
      };
      const res = await fetch("/api/v1/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data?.error || "Não foi possível salvar favorito");
        return;
      }
      await carregarFavoritos();
    } catch (err) {
      setError("Erro ao salvar favorito");
    }
  };

  const removerFavorito = async (id: number) => {
    try {
      await fetch(`/api/v1/favorites?id=${id}`, { method: "DELETE" });
      setFavoritos((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error("Erro ao remover favorito", err);
    }
  };

  useEffect(() => {
    carregarFavoritos();
  }, [clienteId]);

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
                {p.cupomCodigo && (
                  <p><span className="font-semibold">Cupom:</span> {p.cupomCodigo} (-R$ {(p.descontoAplicado || 0).toFixed(2)})</p>
                )}
                <p className="font-semibold text-green-700">Total: R$ {p.valorTotal?.toFixed(2) || "0,00"}</p>
              </div>
              {clienteId && (
                <button
                  onClick={() => salvarFavorito(p)}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition"
                >
                  Salvar como favorito
                </button>
              )}
            </div>
          ))}
          {pedidos.length === 0 && !loading && !error && (
            <p className="text-gray-500 text-sm">Nenhum pedido encontrado.</p>
          )}
        </div>

        {clienteId && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-purple-800 mb-3">Meus Favoritos</h2>
            <p className="text-sm text-gray-600 mb-4">Guarde potes prontos para refazer pedidos rapidamente.</p>
            <div className="space-y-3">
              {favoritos.map((fav) => (
                <div key={fav.id} className="border rounded-xl p-4 bg-white shadow-sm">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <p className="text-lg font-semibold text-gray-800">{fav.nome}</p>
                      <p className="text-sm text-gray-600">Tamanho: {fav.tamanho}</p>
                      <p className="text-sm text-gray-600">Sabores: {fav.sabores.map((s) => s.sabor.nome).join(", ") || "-"}</p>
                      <p className="text-sm text-gray-600">Adicionais: {fav.adicionais.map((a) => a.adicional.nome).join(", ") || "-"}</p>
                      <p className="text-green-700 font-semibold mt-1">R$ {fav.preco.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => removerFavorito(fav.id)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
              {favoritos.length === 0 && (
                <p className="text-sm text-gray-500">Nenhum favorito salvo ainda.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
