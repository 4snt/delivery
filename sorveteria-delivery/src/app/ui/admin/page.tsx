"use client";
import { useEffect, useState } from "react";

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

// Tipos para exibir pedidos no painel
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

export default function AdminPage() {
  const [sabores, setSabores] = useState<Sabor[]>([]);
  const [adicionais, setAdicionais] = useState<Adicional[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  // NOVO: Estado para armazenar os pedidos
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [novoSabor, setNovoSabor] = useState("");
  const [imagemSabor, setImagemSabor] = useState("");
  const [novoAdicional, setNovoAdicional] = useState("");
  const [novoClienteNome, setNovoClienteNome] = useState("");
  const [novoClienteEmail, setNovoClienteEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Carregar sabores, adicionais, clientes e pedidos
  const carregarDados = async () => {
    try {
      setLoading(true);
      const saboresRes = await fetch("/api/sabores");
      const adicionaisRes = await fetch("/api/adicionais");
      const clientesRes = await fetch("/api/clientes");
      const pedidosRes = await fetch("/api/pedidos");

      if (!saboresRes.ok || !adicionaisRes.ok || !clientesRes.ok || !pedidosRes.ok) {
        throw new Error('Erro ao carregar dados');
      }

      const saboresData = await saboresRes.json();
      const adicionaisData = await adicionaisRes.json();
      const clientesData = await clientesRes.json();
      const pedidosData = await pedidosRes.json();

      setSabores(saboresData);
      setAdicionais(adicionaisData);
      setClientes(clientesData);
      setPedidos(pedidosData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // NOVO: Função para alterar o status do pedido
  const handleStatusChange = async (id: number, newStatus: Pedido['status']) => {
    try {
      const response = await fetch(`/api/pedidos`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar o status do pedido');
      }

      // Atualize a lista de pedidos localmente
      setPedidos(pedidos.map(p => p.id === id ? { ...p, status: newStatus } : p));
    } catch (err) {
      console.error(err instanceof Error ? err.message : 'Erro desconhecido ao atualizar status');
    }
  };

  const handleDeletarPedido = async (id: number) => {
    try {
      const response = await fetch(`/api/pedidos?id=${id}`, {
        method: "DELETE",
      });
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
        setSabores(sabores.filter(s => s.id !== id));
      } else {
        console.error("Erro ao remover sabor");
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
        setAdicionais(adicionais.filter(a => a.id !== id));
      } else {
        console.error("Erro ao remover adicional");
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
        setClientes(clientes.filter(c => c.id !== id));
      } else {
        console.error("Erro ao remover cliente");
      }
    } catch (err) {
      console.error("Erro de rede", err);
    }
  };

  if (loading) return <div className="text-center mt-8">Carregando...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Erro: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Painel do Administrador</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Seção de Pedidos (item 4) */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-bold mb-4">Pedidos</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {pedidos.length > 0 ? (
                pedidos.map(p => (
                  <div key={p.id} className="p-3 border rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-50" onClick={() => { setPedidoSelecionado(p); setShowModal(true); }}>
                    <div>
                      <span className="font-medium">Pedido #{p.id} - {p.nome}</span>
                      <p className="text-sm text-gray-500">Status: {p.status}</p>
                    </div>
                    
                    
                    <select
                      value={p.status}
                      onClick={e => e.stopPropagation()}
                      onChange={(e) => handleStatusChange(p.id, e.target.value as Pedido['status'])}
                      className="border rounded p-1 text-sm"
                    >
                      <option value="Em preparo">Em preparo</option>
                      <option value="Saiu para a entrega">Saiu para a entrega</option>
                      <option value="Entregue">Entregue</option>
                    </select>
                  </div>
                  
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
                onChange={e => setNovoSabor(e.target.value)}
                placeholder="Nome do sabor"
                className="border rounded p-2 w-full"
                required
              />
              <input
                type="text"
                value={imagemSabor}
                onChange={e => setImagemSabor(e.target.value)}
                placeholder="URL da imagem (opcional)"
                className="border rounded p-2 w-full"
              />
              <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full">Adicionar</button>
            </form>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {sabores.map(s => (
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
                onChange={e => setNovoAdicional(e.target.value)}
                placeholder="Nome do adicional"
                className="border rounded p-2 w-full"
                required
              />
              <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full">Adicionar</button>
            </form>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {adicionais.map(a => (
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
            <form onSubmit={handleAddCliente} className="space-y-4 mb-4 md:flex md:space-x-4 md:space-y-0">
              <input
                type="text"
                value={novoClienteNome}
                onChange={e => setNovoClienteNome(e.target.value)}
                placeholder="Nome do cliente"
                className="border rounded p-2 w-full"
                required
              />
              <input
                value={novoClienteEmail}
                onChange={e => setNovoClienteEmail(e.target.value)}
                placeholder="Email"
                type="email"
                className="border rounded p-2 w-full"
                required
              />
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded w-full" type="submit">Adicionar</button>
            </form>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {clientes.map(c => (
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
      </div>
      {showModal && pedidoSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={() => setShowModal(false)}>&times;</button>
            <h2 className="text-2xl font-bold mb-4">Detalhes do Pedido #{pedidoSelecionado.id}</h2>
            <div className="space-y-3">
              <div><span className="font-semibold">Status:</span> {pedidoSelecionado.status || '-'}</div>
              <div><span className="font-semibold">Pagamento:</span> {pedidoSelecionado.pagamento || '-'}</div>
              <div><span className="font-semibold">Endereço:</span> {pedidoSelecionado.endereco || '-'}</div>
              <div>
                <span className="font-semibold">Cliente:</span>
                {pedidoSelecionado.cliente ? (
                  <div className="ml-2">
                    <div><span className="font-medium">Nome:</span> {pedidoSelecionado.cliente.nome || '-'}</div>
                    <div><span className="font-medium">Email:</span> {pedidoSelecionado.cliente.email || '-'}</div>
                    <div><span className="font-medium">Endereço:</span> {pedidoSelecionado.cliente.endereco || '-'}</div>
                  </div>
                ) : (
                  <span> -</span>
                )}
              </div>
              <div>
                <span className="font-semibold">Potes:</span>
                {Array.isArray(pedidoSelecionado.potes) && pedidoSelecionado.potes.length > 0 ? (
                  <ul className="list-disc list-inside ml-4">
                    {pedidoSelecionado.potes.map((p: any, idx: number) => (
                      <li key={idx} className="mb-2">
                        <div><span className="font-medium">Tamanho:</span> {p.tamanho}</div>
                        <div><span className="font-medium">Preço:</span> R$ {Number(p.preco || 0).toFixed(2)}</div>
                        <div><span className="font-medium">Sabores:</span> {Array.isArray(p.sabores) && p.sabores.length ? p.sabores.join(', ') : 'Nenhum'}</div>
                        <div><span className="font-medium">Adicionais:</span> {Array.isArray(p.adicionais) && p.adicionais.length ? p.adicionais.join(', ') : 'Nenhum'}</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span> Nenhum</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}