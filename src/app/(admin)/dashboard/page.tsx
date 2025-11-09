"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { OrderCard } from "@/components/shared/OrderCard";
import { Modal } from "@/components/shared/Modal";

interface Sabor {
  id: number;
  nome: string;
  imagem?: string;
}

interface Adicional {
  id: number;
  nome: string;
}

interface Cliente {
  id: number;
  nome: string;
  email: string;
}

interface Produto {
  tamanho: string;
  preco: number;
  sabores: string[];
  adicionais?: string[];
}

interface ClientePedido {
  nome: string;
  email: string;
  endereco?: string;
}

interface Pedido {
  id: number;
  status: string;
  nome?: string;
  pagamento?: string;
  endereco?: string;
  cliente?: ClientePedido;
  potes?: Produto[];
}

export default function DashboardPage() {
  const [sabores, setSabores] = useState<Sabor[]>([]);
  const [adicionais, setAdicionais] = useState<Adicional[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [novoSabor, setNovoSabor] = useState("");
  const [imagemSabor, setImagemSabor] = useState("");
  const [novoAdicional, setNovoAdicional] = useState("");
  const [novoClienteNome, setNovoClienteNome] = useState("");
  const [novoClienteEmail, setNovoClienteEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      // Usar novas APIs v1
      const [saboresRes, adicionaisRes, clientesRes, pedidosRes] =
        await Promise.all([
          fetch("/api/v1/flavors"),
          fetch("/api/v1/additionals"),
          fetch("/api/v1/customers"),
          fetch("/api/v1/orders"),
        ]);

      if (
        !saboresRes.ok ||
        !adicionaisRes.ok ||
        !clientesRes.ok ||
        !pedidosRes.ok
      ) {
        throw new Error("Erro ao carregar dados");
      }

      const [saboresData, adicionaisData, clientesData, pedidosData] =
        await Promise.all([
          saboresRes.json(),
          adicionaisRes.json(),
          clientesRes.json(),
          pedidosRes.json(),
        ]);

      // Transformar dados da v1 para o formato esperado
      setSabores(
        saboresData.map((s: any) => ({ id: s.id, nome: s.name, imagem: s.image }))
      );
      setAdicionais(
        adicionaisData.map((a: any) => ({ id: a.id, nome: a.name }))
      );
      setClientes(
        clientesData.map((c: any) => ({ id: c.id, nome: c.name, email: c.email }))
      );
      setPedidos(pedidosData); // TODO: transformar quando necessário
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      // Usar nova API v1
      const response = await fetch(`/api/v1/admin/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar o status do pedido");
      }

      setPedidos(
        pedidos.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      console.error(
        err instanceof Error ? err.message : "Erro desconhecido ao atualizar status"
      );
    }
  };

  const handleDeletarPedido = async (id: number) => {
    try {
      const response = await fetch(`/api/v1/orders/${id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        setPedidos((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Erro de rede", err);
    }
  };

  const handleAddSabor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoSabor) return;
    
    try {
      const response = await fetch("/api/sabores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: novoSabor, imagem: imagemSabor }),
      });
      const newSabor = await response.json();
      setSabores([...sabores, newSabor]);
      setNovoSabor("");
      setImagemSabor("");
    } catch (err) {
      console.error("Erro ao adicionar sabor", err);
    }
  };

  const handleRemoveSabor = async (id: number) => {
    try {
      const response = await fetch(`/api/sabores?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setSabores(sabores.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error("Erro de rede", err);
    }
  };

  const handleAddAdicional = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoAdicional) return;
    
    try {
      const response = await fetch("/api/adicionais", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: novoAdicional }),
      });
      const newAdicional = await response.json();
      setAdicionais([...adicionais, newAdicional]);
      setNovoAdicional("");
    } catch (err) {
      console.error("Erro ao adicionar adicional", err);
    }
  };

  const handleRemoveAdicional = async (id: number) => {
    try {
      const response = await fetch(`/api/adicionais?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setAdicionais(adicionais.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error("Erro de rede", err);
    }
  };

  const handleAddCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoClienteNome || !novoClienteEmail) return;
    
    try {
      const response = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: novoClienteNome, email: novoClienteEmail }),
      });
      const newCliente = await response.json();
      setClientes([...clientes, newCliente]);
      setNovoClienteNome("");
      setNovoClienteEmail("");
    } catch (err) {
      console.error("Erro ao adicionar cliente", err);
    }
  };

  const handleRemoveCliente = async (id: number) => {
    try {
      const response = await fetch(`/api/clientes?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setClientes(clientes.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error("Erro de rede", err);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center mt-8">Carregando...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center mt-8 text-red-500">Erro: {error}</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard</h1>

      {/* Stats */}
      <DashboardStats
        totalOrders={pedidos.length}
        totalCustomers={clientes.length}
        totalFlavors={sabores.length}
        totalAdditionals={adicionais.length}
        totalRevenue={pedidos.reduce((sum, p) => sum + (p.potes?.reduce((s, pot) => s + pot.preco, 0) || 0), 0)}
      />

      {/* Grid de Seções */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Seção de Pedidos */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Pedidos</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {pedidos.length > 0 ? (
              pedidos.map((p) => (
                <OrderCard
                  key={p.id}
                  id={p.id}
                  customerName={p?.cliente?.nome || p?.nome || "-"}
                  customerEmail={p?.cliente?.email}
                  status={p.status}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeletarPedido}
                  onClick={(id) => {
                    setPedidoSelecionado(p);
                    setShowModal(true);
                  }}
                />
              ))
            ) : (
              <p>Nenhum pedido encontrado.</p>
            )}
          </div>
        </div>

        {/* Seção de Sabores */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Gerenciar Sabores</h2>
          <form onSubmit={handleAddSabor} className="space-y-4 mb-4">
            <input
              type="text"
              value={novoSabor}
              onChange={(e) => setNovoSabor(e.target.value)}
              placeholder="Nome do sabor"
              className="border rounded p-2 w-full"
              required
            />
            <input
              type="text"
              value={imagemSabor}
              onChange={(e) => setImagemSabor(e.target.value)}
              placeholder="URL da imagem (opcional)"
              className="border rounded p-2 w-full"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
              Adicionar
            </button>
          </form>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {sabores.map((s) => (
              <div key={s.id} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium">{s.nome}</span>
                    {s.imagem && (
                      <img
                        src={s.imagem}
                        alt={s.nome}
                        className="w-20 h-20 object-cover rounded mt-2"
                      />
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveSabor(s.id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seção de Adicionais */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Gerenciar Adicionais</h2>
          <form onSubmit={handleAddAdicional} className="space-y-4 mb-4">
            <input
              type="text"
              value={novoAdicional}
              onChange={(e) => setNovoAdicional(e.target.value)}
              placeholder="Nome do adicional"
              className="border rounded p-2 w-full"
              required
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full"
            >
              Adicionar
            </button>
          </form>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {adicionais.map((a) => (
              <div key={a.id} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start">
                  <span className="font-medium">{a.nome}</span>
                  <button
                    onClick={() => handleRemoveAdicional(a.id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seção de Clientes */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 md:col-span-2 lg:col-span-3">
          <h2 className="text-2xl font-bold mb-4">Gerenciar Clientes</h2>
          <form
            onSubmit={handleAddCliente}
            className="space-y-4 mb-4 md:flex md:space-x-4 md:space-y-0"
          >
            <input
              type="text"
              value={novoClienteNome}
              onChange={(e) => setNovoClienteNome(e.target.value)}
              placeholder="Nome do cliente"
              className="border rounded p-2 w-full"
              required
            />
            <input
              value={novoClienteEmail}
              onChange={(e) => setNovoClienteEmail(e.target.value)}
              placeholder="Email"
              type="email"
              className="border rounded p-2 w-full"
              required
            />
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded w-full md:w-auto"
              type="submit"
            >
              Adicionar
            </button>
          </form>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {clientes.map((c) => (
              <div key={c.id} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium">{c.nome}</span>
                    <p className="text-sm text-gray-500">{c.email}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveCliente(c.id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de Detalhes do Pedido */}
      {showModal && pedidoSelecionado && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={`Detalhes do Pedido #${pedidoSelecionado.id}`}
        >
          <div>
            <span className="font-semibold">Status:</span>{" "}
            {pedidoSelecionado.status || "-"}
          </div>
          <div>
            <span className="font-semibold">Pagamento:</span>{" "}
            {pedidoSelecionado.pagamento || "-"}
          </div>
          <div>
            <span className="font-semibold">Endereço:</span>{" "}
            {pedidoSelecionado.endereco || "-"}
          </div>
          <div>
            <span className="font-semibold">Cliente:</span>
            {pedidoSelecionado.cliente ? (
              <div className="ml-2">
                <div>
                  <span className="font-medium">Nome:</span>{" "}
                  {pedidoSelecionado.cliente.nome || "-"}
                </div>
                <div>
                  <span className="font-medium">Email:</span>{" "}
                  {pedidoSelecionado.cliente.email || "-"}
                </div>
                <div>
                  <span className="font-medium">Endereço:</span>{" "}
                  {pedidoSelecionado.cliente.endereco || "-"}
                </div>
              </div>
            ) : (
              <span> -</span>
            )}
          </div>
          <div>
            <span className="font-semibold">Potes:</span>
            {Array.isArray(pedidoSelecionado.potes) &&
            pedidoSelecionado.potes.length > 0 ? (
              <ul className="list-disc list-inside ml-4">
                {pedidoSelecionado.potes.map((p: any, idx: number) => (
                  <li key={idx} className="mb-2">
                    <div>
                      <span className="font-medium">Tamanho:</span> {p.tamanho}
                    </div>
                    <div>
                      <span className="font-medium">Preço:</span> R${" "}
                      {Number(p.preco || 0).toFixed(2)}
                    </div>
                    <div>
                      <span className="font-medium">Sabores:</span>{" "}
                      {Array.isArray(p.sabores) && p.sabores.length
                        ? p.sabores.join(", ")
                        : "Nenhum"}
                    </div>
                    <div>
                      <span className="font-medium">Adicionais:</span>{" "}
                      {Array.isArray(p.adicionais) && p.adicionais.length
                        ? p.adicionais.join(", ")
                        : "Nenhum"}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <span> Nenhum</span>
            )}
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}
