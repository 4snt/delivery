"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { OrderCard } from "@/components/shared/OrderCard";
import { Modal } from "@/components/shared/Modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faTrash, 
  faIceCream, 
  faPlusCircle, 
  faUsers,
  faBoxOpen,
  faTicketAlt,
  faStar
} from '@fortawesome/free-solid-svg-icons';

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

interface Cupom {
  id: number;
  codigo: string;
  descricao?: string | null;
  tipo: string;
  valor: number;
  valorMinimo: number;
  usoMaximo?: number | null;
  usosAtuais: number;
  ativo: boolean;
  expiraEm?: string | null;
}

interface ClienteFidelidade {
  id: number;
  nome: string;
  email: string;
  pontosFidelidade: number;
  transacoes?: { id: number; pontos: number; tipo: string; descricao?: string | null; createdAt: string }[];
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
  const [cupons, setCupons] = useState<Cupom[]>([]);
  const [novoCupom, setNovoCupom] = useState({
    codigo: "",
    tipo: "percentual",
    valor: 10,
    valorMinimo: 0,
  });
  const [clientesFidelidade, setClientesFidelidade] = useState<ClienteFidelidade[]>([]);
  const [ajustePontos, setAjustePontos] = useState<{ [key: number]: number }>({});
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
      const [saboresRes, adicionaisRes, clientesRes, pedidosRes, cuponsRes, fidelidadeRes] =
        await Promise.all([
          fetch("/api/v1/flavors"),
          fetch("/api/v1/additionals"),
          fetch("/api/v1/customers"),
          fetch("/api/v1/orders"),
          fetch("/api/v1/coupons"),
          fetch("/api/v1/loyalty"),
        ]);

      if (
        !saboresRes.ok ||
        !adicionaisRes.ok ||
        !clientesRes.ok ||
        !pedidosRes.ok ||
        !cuponsRes.ok ||
        !fidelidadeRes.ok
      ) {
        throw new Error("Erro ao carregar dados");
      }

      const [saboresData, adicionaisData, clientesData, pedidosData, cuponsData, fidelidadeData] =
        await Promise.all([
          saboresRes.json(),
          adicionaisRes.json(),
          clientesRes.json(),
          pedidosRes.json(),
          cuponsRes.json(),
          fidelidadeRes.json(),
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
      setCupons(cuponsData);
      setClientesFidelidade(fidelidadeData);
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

  const handleCriarCupom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/v1/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoCupom),
      });
      if (!response.ok) {
        throw new Error("Erro ao salvar cupom");
      }
      const cupomSalvo = await response.json();
      setCupons((prev) => [cupomSalvo, ...prev.filter((c) => c.codigo !== cupomSalvo.codigo)]);
      setNovoCupom({ codigo: "", tipo: "percentual", valor: 10, valorMinimo: 0 });
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleCupom = async (codigo: string, ativo: boolean) => {
    try {
      const res = await fetch("/api/v1/coupons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo, ativo }),
      });
      if (!res.ok) throw new Error("Erro ao atualizar cupom");
      const updated = await res.json();
      setCupons((prev) => prev.map((c) => (c.codigo === codigo ? updated : c)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAjustarPontos = async (clienteId: number, pontos: number) => {
    try {
      const res = await fetch("/api/v1/loyalty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clienteId, pontos, tipo: pontos >= 0 ? "earn" : "redeem", descricao: "Ajuste manual" }),
      });
      if (!res.ok) throw new Error("Erro ao registrar pontos");
      const data = await res.json();
      setClientesFidelidade((prev) =>
        prev.map((c) => (c.id === clienteId ? { ...c, pontosFidelidade: data.cliente.pontosFidelidade ?? c.pontosFidelidade } : c))
      );
      setAjustePontos((prev) => ({ ...prev, [clienteId]: 0 }));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dados...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <h3 className="text-red-800 font-bold text-lg mb-2">Erro ao carregar dados</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-purple-100">Gerencie seu negócio em um só lugar</p>
        </div>

        {/* Stats */}
        <DashboardStats
          totalOrders={pedidos.length}
          totalCustomers={clientes.length}
          totalFlavors={sabores.length}
          totalAdditionals={adicionais.length}
          totalRevenue={pedidos.reduce((sum, p) => sum + (p.potes?.reduce((s, pot) => s + pot.preco, 0) || 0), 0)}
        />

        {/* Grid de Seções */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Seção de Pedidos */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faBoxOpen} className="text-2xl" />
                <h2 className="text-2xl font-bold">Pedidos Recentes</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
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
                  <div className="text-center py-8 text-gray-400">
                    <FontAwesomeIcon icon={faBoxOpen} className="text-4xl mb-3 opacity-50" />
                    <p>Nenhum pedido encontrado</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Seção de Sabores */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faIceCream} className="text-2xl" />
                <h2 className="text-2xl font-bold">Gerenciar Sabores</h2>
              </div>
            </div>
            <div className="p-6">
              <form onSubmit={handleAddSabor} className="space-y-3 mb-6">
                <input
                  type="text"
                  value={novoSabor}
                  onChange={(e) => setNovoSabor(e.target.value)}
                  placeholder="Nome do sabor"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                  required
                />
                <input
                  type="text"
                  value={imagemSabor}
                  onChange={(e) => setImagemSabor(e.target.value)}
                  placeholder="URL da imagem (opcional)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-4 py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Adicionar Sabor
                </button>
              </form>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {sabores.map((s) => (
                  <div key={s.id} className="p-4 border border-gray-200 rounded-lg hover:border-yellow-300 transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <span className="font-semibold text-gray-800">{s.nome}</span>
                        {s.imagem && (
                          <img
                            src={s.imagem}
                            alt={s.nome}
                            className="w-20 h-20 object-cover rounded-lg mt-2 shadow"
                          />
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveSabor(s.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Seção de Adicionais */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faPlusCircle} className="text-2xl" />
                <h2 className="text-2xl font-bold">Gerenciar Adicionais</h2>
              </div>
            </div>
            <div className="p-6">
              <form onSubmit={handleAddAdicional} className="space-y-3 mb-6">
                <input
                  type="text"
                  value={novoAdicional}
                  onChange={(e) => setNovoAdicional(e.target.value)}
                  placeholder="Nome do adicional"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Adicionar Adicional
                </button>
              </form>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {adicionais.map((a) => (
                  <div key={a.id} className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-800">{a.nome}</span>
                      <button
                        onClick={() => handleRemoveAdicional(a.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Seção de Clientes */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden lg:col-span-2">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faUsers} className="text-2xl" />
                <h2 className="text-2xl font-bold">Gerenciar Clientes</h2>
              </div>
            </div>
            <div className="p-6">
              <form
                onSubmit={handleAddCliente}
                className="space-y-3 md:space-y-0 md:grid md:grid-cols-3 md:gap-3 mb-6"
              >
                <input
                  type="text"
                  value={novoClienteNome}
                  onChange={(e) => setNovoClienteNome(e.target.value)}
                  placeholder="Nome do cliente"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  required
                />
                <input
                  value={novoClienteEmail}
                  onChange={(e) => setNovoClienteEmail(e.target.value)}
                  placeholder="Email"
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  required
                />
                <button
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  type="submit"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Adicionar Cliente
                </button>
              </form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
                {clientes.map((c) => (
                  <div key={c.id} className="p-4 border border-gray-200 rounded-lg hover:border-green-300 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-semibold text-gray-800 block">{c.nome}</span>
                        <p className="text-sm text-gray-500">{c.email}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveCliente(c.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Cupom e Fidelização */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Cupons */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 text-white">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FontAwesomeIcon icon={faTicketAlt} />
                Cupons
              </h2>
              <p className="text-sm text-indigo-100">Crie e ative/desative cupons definidos pelo admin.</p>
            </div>
            <div className="p-6 space-y-4">
              <form onSubmit={handleCriarCupom} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  value={novoCupom.codigo}
                  onChange={(e) => setNovoCupom({ ...novoCupom, codigo: e.target.value.toUpperCase() })}
                  placeholder="Código"
                  className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <select
                  value={novoCupom.tipo}
                  onChange={(e) => setNovoCupom({ ...novoCupom, tipo: e.target.value })}
                  className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="percentual">Percentual</option>
                  <option value="valor_fixo">Valor fixo</option>
                </select>
                <input
                  type="number"
                  min={0}
                  value={novoCupom.valor}
                  onChange={(e) => setNovoCupom({ ...novoCupom, valor: Number(e.target.value) })}
                  placeholder="Valor do desconto"
                  className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <input
                  type="number"
                  min={0}
                  value={novoCupom.valorMinimo}
                  onChange={(e) => setNovoCupom({ ...novoCupom, valorMinimo: Number(e.target.value) })}
                  placeholder="Valor mínimo (opcional)"
                  className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="md:col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-semibold"
                >
                  Salvar Cupom
                </button>
              </form>

              <div className="divide-y">
                {cupons.map((cupom) => (
                  <div key={cupom.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">{cupom.codigo}</p>
                      <p className="text-sm text-gray-600">
                        {cupom.tipo === "percentual" ? `${cupom.valor}%` : `R$ ${cupom.valor.toFixed(2)}`} · Mín.: R$ {cupom.valorMinimo.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{cupom.usosAtuais}/{cupom.usoMaximo || "∞"}</span>
                      <button
                        onClick={() => handleToggleCupom(cupom.codigo, !cupom.ativo)}
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${cupom.ativo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                      >
                        {cupom.ativo ? "Ativo" : "Inativo"}
                      </button>
                    </div>
                  </div>
                ))}
                {cupons.length === 0 && <p className="text-sm text-gray-500">Nenhum cupom cadastrado.</p>}
              </div>
            </div>
          </div>

          {/* Fidelização */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FontAwesomeIcon icon={faStar} />
                Fidelização
              </h2>
              <p className="text-sm text-emerald-100">Acompanhe pontos e ajuste manualmente.</p>
            </div>
            <div className="p-6 space-y-3 max-h-[500px] overflow-y-auto">
              {clientesFidelidade.map((c) => (
                <div key={c.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">{c.nome}</p>
                      <p className="text-sm text-gray-500">{c.email}</p>
                      <p className="text-emerald-700 font-bold mt-1">{c.pontosFidelidade} pts</p>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={ajustePontos[c.id] ?? 0}
                        onChange={(e) => setAjustePontos((prev) => ({ ...prev, [c.id]: Number(e.target.value) }))}
                        className="w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        onClick={() => handleAjustarPontos(c.id, Number(ajustePontos[c.id] ?? 0))}
                        className="px-3 py-2 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600"
                      >
                        Ajustar
                      </button>
                    </div>
                  </div>
                  {c.transacoes && c.transacoes.length > 0 && (
                    <div className="mt-3 text-xs text-gray-600 space-y-1">
                      {c.transacoes.map((t) => (
                        <div key={t.id} className="flex justify-between">
                          <span>{t.tipo === "earn" ? "+" : ""}{t.pontos} pts {t.descricao ? `· ${t.descricao}` : ""}</span>
                          <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {clientesFidelidade.length === 0 && <p className="text-sm text-gray-500">Nenhum cliente com pontos.</p>}
            </div>
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
          <div className="space-y-4">
            <div className="border-b pb-3">
              <span className="font-semibold text-gray-700">Status:</span>{" "}
              <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {pedidoSelecionado.status || "-"}
              </span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Pagamento:</span>{" "}
              <span className="text-gray-600">{pedidoSelecionado.pagamento || "-"}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Endereço:</span>{" "}
              <span className="text-gray-600">{pedidoSelecionado.endereco || "-"}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Cliente:</span>
              {pedidoSelecionado.cliente ? (
                <div className="ml-4 mt-2 p-3 bg-gray-50 rounded-lg">
                  <div className="mb-1">
                    <span className="font-medium text-gray-600">Nome:</span>{" "}
                    <span className="text-gray-800">{pedidoSelecionado.cliente.nome || "-"}</span>
                  </div>
                  <div className="mb-1">
                    <span className="font-medium text-gray-600">Email:</span>{" "}
                    <span className="text-gray-800">{pedidoSelecionado.cliente.email || "-"}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Endereço:</span>{" "}
                    <span className="text-gray-800">{pedidoSelecionado.cliente.endereco || "-"}</span>
                  </div>
                </div>
              ) : (
                <span className="text-gray-600"> -</span>
              )}
            </div>
            <div>
              <span className="font-semibold text-gray-700 block mb-2">Potes:</span>
              {Array.isArray(pedidoSelecionado.potes) &&
              pedidoSelecionado.potes.length > 0 ? (
                <div className="space-y-3">
                  {pedidoSelecionado.potes.map((p: any, idx: number) => (
                    <div key={idx} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="mb-2">
                        <span className="font-medium text-gray-700">Tamanho:</span>{" "}
                        <span className="text-gray-800">{p.tamanho}</span>
                      </div>
                      <div className="mb-2">
                        <span className="font-medium text-gray-700">Preço:</span>{" "}
                        <span className="text-green-600 font-semibold">R$ {Number(p.preco || 0).toFixed(2)}</span>
                      </div>
                      <div className="mb-2">
                        <span className="font-medium text-gray-700">Sabores:</span>{" "}
                        <span className="text-gray-800">
                          {Array.isArray(p.sabores) && p.sabores.length
                            ? p.sabores.join(", ")
                            : "Nenhum"}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Adicionais:</span>{" "}
                        <span className="text-gray-800">
                          {Array.isArray(p.adicionais) && p.adicionais.length
                            ? p.adicionais.join(", ")
                            : "Nenhum"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-gray-600"> Nenhum</span>
              )}
            </div>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}
