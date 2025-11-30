"use client";
import { usePedido } from "@/app/ui/pedido/PedidoContext";
import { useRouter } from "next/navigation";

type Props = {
  onClose?: () => void;
};

export default function CartDropdown({ onClose }: Props) {
  const { pedido, removerPote } = usePedido();
  const router = useRouter();

  const total = pedido.potes.reduce((acc, pote) => acc + pote.preco, 0);

  const goToCart = () => {
    onClose?.();
    router.push("/ui/pedido/carrinho");
  };

  const goToCheckout = () => {
    onClose?.();
    router.push("/ui/pedido/login");
  };

  return (
    <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-white text-gray-900 shadow-2xl ring-1 ring-purple-100 p-4 z-50">
      <div className="flex items-center justify-between mb-3">
        <p className="font-semibold text-purple-700">Seu carrinho</p>
        <span className="text-sm text-gray-500">{pedido.potes.length} item(s)</span>
      </div>

      {pedido.potes.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">Carrinho vazio</p>
      ) : (
        <div className="space-y-3 max-h-64 overflow-auto pr-1">
          {pedido.potes.map((pote, idx) => (
            <div key={idx} className="border border-gray-100 rounded-xl p-3 bg-purple-50/40">
              <div className="flex justify-between items-center mb-1">
                <p className="font-semibold text-purple-800">Pote {idx + 1} · {pote.tamanho}</p>
                <button
                  onClick={() => removerPote(idx)}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  remover
                </button>
              </div>
              <p className="text-sm text-gray-700">
                Sabores: {pote.sabores.map((s) => s.nome).join(", ")}
              </p>
              {pote.adicionais?.length ? (
                <p className="text-sm text-gray-600">
                  Adicionais: {pote.adicionais.map((a) => a.nome).join(", ")}
                </p>
              ) : null}
              <p className="text-sm font-semibold text-green-700 mt-1">
                R$ {pote.preco.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 border-t border-gray-100 pt-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-800">Total</span>
        <span className="text-lg font-bold text-green-700">R$ {total.toFixed(2)}</span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={goToCart}
          className="w-full py-2 rounded-xl text-sm font-semibold text-purple-700 border border-purple-200 hover:bg-purple-50 transition"
        >
          Ver carrinho
        </button>
        <button
          onClick={goToCheckout}
          className="w-full py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:brightness-110 transition"
          disabled={pedido.potes.length === 0}
        >
          Finalizar
        </button>
      </div>
    </div>
  );
}
