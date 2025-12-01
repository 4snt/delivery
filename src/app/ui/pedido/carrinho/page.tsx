"use client";
import { usePedido } from "../PedidoContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function CarrinhoPage() {
  const { pedido, removerPote, aplicarCupom, removerCupom } = usePedido();
  const router = useRouter();
  const { data: session } = useSession();
  const [codigoCupom, setCodigoCupom] = useState(pedido.cupom?.codigo || "");
  const [cupomMensagem, setCupomMensagem] = useState<string | null>(null);
  const [aplicandoCupom, setAplicandoCupom] = useState(false);
  const [favoritoMensagem, setFavoritoMensagem] = useState<string | null>(null);

  const totalBruto = pedido.potes.reduce((acc, pote) => acc + pote.preco, 0);
  const desconto = pedido.desconto || 0;
  const total = Math.max(0, totalBruto - desconto);
  const clienteId = (session?.user as any)?.id;

  const handleRemover = (idx: number) => {
    removerPote(idx);
  };

  const handleAdicionarMais = () => {
    router.push("/ui/pedido/tamanho");
  };

  const handleFinalizar = () => {
    if (pedido.potes.length === 0) return;
    router.push("/ui/pedido/login");
  };

  const handleAplicarCupom = async () => {
    if (!codigoCupom) return;
    setAplicandoCupom(true);
    setCupomMensagem(null);
    try {
      const params = new URLSearchParams({
        codigo: codigoCupom.trim(),
        valorTotal: totalBruto.toString(),
      });
      const res = await fetch(`/api/v1/coupons/validate?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        setCupomMensagem(data?.error || "Não foi possível aplicar o cupom");
        removerCupom();
        return;
      }
      aplicarCupom({
        codigo: codigoCupom.trim(),
        desconto: data.desconto,
        tipo: data.cupom.tipo,
        valor: data.cupom.valor,
      });
      setCupomMensagem(`Cupom aplicado: -R$ ${data.desconto.toFixed(2)}`);
    } catch (err) {
      setCupomMensagem("Erro ao validar cupom");
      removerCupom();
    } finally {
      setAplicandoCupom(false);
    }
  };

  const handleSalvarFavorito = async (idx: number) => {
    setFavoritoMensagem(null);
    if (!clienteId) {
      setFavoritoMensagem("Entre para salvar favoritos.");
      router.push("/login");
      return;
    }
    const pote = pedido.potes[idx];
    try {
      const res = await fetch("/api/v1/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clienteId,
          nome: `Pote ${idx + 1} - ${pote.tamanho}`,
          tamanho: pote.tamanho,
          preco: pote.preco,
          sabores: pote.sabores.map((s) => ({ id: s.id })),
          adicionais: (pote.adicionais || []).map((a) => ({ id: a.id })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFavoritoMensagem(data?.error || "Erro ao salvar favorito.");
        return;
      }
      setFavoritoMensagem("Favorito salvo! Veja em Acompanhar > Meus Favoritos.");
    } catch (err) {
      setFavoritoMensagem("Erro ao salvar favorito.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-purple-700 mb-2">
              Seu Carrinho
            </h1>
            <p className="text-gray-600">
              Revise seu pedido antes de finalizar
            </p>
          </div>

          {pedido.potes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4"></div>
              <p className="text-gray-500 text-xl mb-6">
                Seu carrinho está vazio
              </p>
              <button
                onClick={() => router.push("/ui/pedido/tamanho")}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg transition-all"
              >
                Começar Pedido
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-8">
                {pedido.potes.map((pote, idx) => (
                  <div
                    key={idx}
                    className="border-2 border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-purple-700 mb-2">
                          Pote {idx + 1} - {pote.tamanho.charAt(0).toUpperCase() + pote.tamanho.slice(1)}
                        </h3>
                        <p className="text-2xl font-bold text-green-600">
                          R$ {pote.preco.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemover(idx)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                      >
                        Remover
                      </button>
                      <button
                        onClick={() => handleSalvarFavorito(idx)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-all ml-2"
                      >
                        Salvar favorito
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-600 mb-1">
                          Sabores:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {pote.sabores.map((sabor, i) => (
                            <span
                              key={i}
                              className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium"
                            >
                              {sabor.nome}
                            </span>
                          ))}
                        </div>
                      </div>

                      {pote.adicionais && pote.adicionais.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-gray-600 mb-1">
                            Adicionais:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {pote.adicionais.map((adicional, i) => (
                              <span
                                key={i}
                                className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium"
                              >
                                {adicional.nome}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-6 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-700">Subtotal</span>
                  <span className="text-2xl font-bold text-gray-900">
                    R$ {totalBruto.toFixed(2)}
                  </span>
                </div>
                {desconto > 0 && (
                  <div className="flex justify-between items-center text-green-700">
                    <span className="text-sm font-semibold">Desconto ({pedido.cupom?.codigo})</span>
                    <span className="text-xl font-bold">- R$ {desconto.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center border-t border-purple-100 pt-2">
                  <span className="text-2xl font-bold text-gray-800">Total:</span>
                  <span className="text-4xl font-bold text-green-600">
                    R$ {total.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2 text-right">
                  {pedido.potes.length} {pedido.potes.length === 1 ? 'pote' : 'potes'} no carrinho
                </p>
              </div>

              {/* Cupom */}
              <div className="bg-white border border-purple-100 rounded-xl p-4 mb-6 space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    value={codigoCupom}
                    onChange={(e) => setCodigoCupom(e.target.value)}
                    placeholder="Código do cupom"
                    className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAplicarCupom}
                      disabled={!codigoCupom || aplicandoCupom}
                      className="bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg font-semibold"
                    >
                      {aplicandoCupom ? "Aplicando..." : "Aplicar"}
                    </button>
                    {pedido.cupom && (
                      <button
                        onClick={() => { removerCupom(); setCupomMensagem(null); }}
                        className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                </div>
                {cupomMensagem && (
                  <p className={`text-sm ${cupomMensagem.startsWith("Cupom") ? "text-green-700" : "text-red-600"}`}>
                    {cupomMensagem}
                  </p>
                )}
                {favoritoMensagem && (
                  <p className="text-sm text-purple-700">{favoritoMensagem}</p>
                )}
              </div>

              {/* Botões de ação */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAdicionarMais}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl text-lg font-bold shadow-lg transition-all"
                >
                  ➕ Adicionar mais potes
                </button>
                <button
                  onClick={handleFinalizar}
                  disabled={pedido.potes.length === 0}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 text-white py-4 rounded-xl text-lg font-bold shadow-lg transition-all disabled:cursor-not-allowed"
                >
                  Finalizar Pedido
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
