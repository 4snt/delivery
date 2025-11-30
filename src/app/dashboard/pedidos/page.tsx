"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Pedido = {
  id: number;
  status: string;
  valorTotal: number;
  formaPagamento: string;
  enderecoEntrega: string;
  createdAt?: string;
  cliente?: { nome: string; email: string };
  sabores?: { sabor: { nome: string } }[];
  adicionais?: { adicional: { nome: string } }[];
};

const statuses = ["Pendente", "Em preparo", "Saiu para entrega", "Entregue", "Cancelado"];

export default function AdminPedidosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    const isAdmin = (session?.user as any)?.isAdmin;
    if (status === "authenticated" && !isAdmin) {
      router.push("/");
    }
  }, [status, router, session?.user]);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const res = await fetch("/api/pedidos");
        if (!res.ok) throw new Error("Erro ao carregar pedidos");
        const data = await res.json();
        setPedidos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao buscar pedidos");
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, []);

  const handleStatus = async (id: number, novo: string) => {
    try {
      const res = await fetch("/api/pedidos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: novo }),
      });
      if (!res.ok) throw new Error("Falha ao atualizar status");
      const updated = await res.json();
      setPedidos((prev) => prev.map((p) => (p.id === id ? { ...p, status: updated.status } : p)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro desconhecido");
    }
  };

  const totalPedidos = useMemo(() => pedidos.length, [pedidos]);
  const totalEntregue = useMemo(() => pedidos.filter((p) => p.status === "Entregue").length, [pedidos]);
  const formatData = (dateStr?: string) => {
    if (!dateStr) return "-";
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? "-" : parsed.toLocaleString();
  };

  if (loading) return <div className="p-6">Carregando pedidos...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!session?.user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Pedidos (Admin)</h1>
            <p className="text-gray-600 text-sm">Gerencie status e acompanhe pedidos em tempo real.</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white shadow rounded-xl px-4 py-2 text-center">
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-lg font-semibold text-gray-800">{totalPedidos}</p>
            </div>
            <div className="bg-white shadow rounded-xl px-4 py-2 text-center">
              <p className="text-xs text-gray-500">Entregues</p>
              <p className="text-lg font-semibold text-green-700">{totalEntregue}</p>
            </div>
          </div>
        </header>

        <div className="grid gap-4">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="bg-white shadow-sm border border-gray-100 rounded-2xl p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-xs text-gray-500">Pedido #{pedido.id}</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {pedido.cliente?.nome || "Cliente"} • {pedido.cliente?.email || "-"}
                  </p>
                  <p className="text-sm text-gray-600">R$ {pedido.valorTotal?.toFixed(2) || "0,00"} · {pedido.formaPagamento}</p>
                </div>
                <select
                  value={pedido.status}
                  onChange={(e) => handleStatus(pedido.id, e.target.value)}
                  className="rounded-lg border-gray-200 text-sm px-3 py-2 bg-gray-50"
                >
                  {statuses.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-gray-700">
                <p><span className="font-semibold">Endereço:</span> {pedido.enderecoEntrega}</p>
                <p><span className="font-semibold">Sabores:</span> {pedido.sabores?.map((s) => s.sabor.nome).join(", ") || "-"}</p>
                <p><span className="font-semibold">Adicionais:</span> {pedido.adicionais?.map((a) => a.adicional.nome).join(", ") || "-"}</p>
                <p className="text-xs text-gray-500">Criado em {formatData(pedido.createdAt)}</p>
              </div>
            </div>
          ))}
          {pedidos.length === 0 && (
            <div className="bg-white rounded-xl border border-dashed border-gray-200 p-6 text-center text-gray-500">
              Nenhum pedido encontrado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
