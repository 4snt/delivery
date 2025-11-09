"use client";
import { usePedido } from "../PedidoContext";
import { useRouter } from "next/navigation";

export default function CarrinhoPage() {
  const { pedido, removerPote } = usePedido();
  const router = useRouter();

  const total = pedido.potes.reduce((acc, pote) => acc + pote.preco, 0);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-purple-700 mb-2">
              🛒 Seu Carrinho
            </h1>
            <p className="text-gray-600">
              Revise seu pedido antes de finalizar
            </p>
          </div>

          {pedido.potes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍦</div>
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
                              {sabor}
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
                                {adicional}
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
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-800">Total:</span>
                  <span className="text-4xl font-bold text-green-600">
                    R$ {total.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2 text-right">
                  {pedido.potes.length} {pedido.potes.length === 1 ? 'pote' : 'potes'} no carrinho
                </p>
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
                  Finalizar Pedido 🎉
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


