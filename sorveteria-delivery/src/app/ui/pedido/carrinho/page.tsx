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
    router.push("/ui/pedido/login"); // depois criar tela de login/cadastro
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-green-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6 text-purple-700">Seu Carrinho</h1>
        {pedido.potes.length === 0 ? (
          <p className="text-gray-500 text-xl">Nenhum pote adicionado ainda.</p>
        ) : (
          <ul className="w-full mb-6">
            {pedido.potes.map((pote, idx) => (
              <li key={idx} className="mb-4 border-b pb-4 flex justify-between items-center">
                <div>
                  <b>Pote {idx + 1}:</b> {pote.tamanho} - R$ {pote.preco.toFixed(2)}<br />
                  <b>Sabores:</b> {pote.sabores.join(", ")}<br />
                  <b>Adicionais:</b> {pote.adicionais?.length ? pote.adicionais.join(", ") : "Nenhum"}
                </div>
                <button onClick={() => handleRemover(idx)} className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Remover</button>
              </li>
            ))}
          </ul>
        )}
        <div className="w-full flex justify-between items-center mb-6">
          <span className="text-xl font-bold">Total:</span>
          <span className="text-2xl font-bold text-green-600">R$ {total.toFixed(2)}</span>
        </div>
        <div className="w-full flex gap-4">
          <button onClick={handleAdicionarMais} className="flex-1 py-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600">Adicionar mais potes</button>
          <button onClick={handleFinalizar} className="flex-1 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700" disabled={pedido.potes.length === 0}>Finalizar Pedido</button>
        </div>
      </div>
    </div>
  );
}


