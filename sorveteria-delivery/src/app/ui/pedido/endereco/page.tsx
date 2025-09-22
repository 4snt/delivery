"use client";
import { usePedido } from "../PedidoContext";
import { useState } from "react";

export default function EnderecoPage() {
  const { pedido, setPedido } = usePedido();
  const [endereco, setEndereco] = useState(pedido.endereco || "");
  const [finalizado, setFinalizado] = useState(false);

  const handleFinalizar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!endereco) return;
    const pedidoFinal = { ...pedido, endereco };
    try {
      await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedidoFinal),
      });
      setPedido(pedidoFinal);
      setFinalizado(true);
    } catch (err) {
      alert("Erro ao salvar pedido. Tente novamente.");
    }
  };

  if (finalizado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-green-100 p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4 text-purple-700">Pedido Finalizado!</h1>
          <h2 className="text-lg font-semibold mb-4 text-green-600">Resumo do Pedido:</h2>
          <ul className="text-left mb-6 w-full text-gray-700">
            <li><b>Tamanho:</b> {pedido.tamanho}</li>
            <li><b>Sabores:</b> {pedido.sabores?.join(", ")}</li>
            <li><b>Adicionais:</b> {pedido.adicionais?.length ? pedido.adicionais.join(", ") : "Nenhum"}</li>
            <li><b>Pagamento:</b> {pedido.pagamento}</li>
            <li><b>Endereço:</b> {endereco}</li>
          </ul>
          <p className="font-semibold text-purple-700">Obrigado pelo seu pedido! Em breve será entregue.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-green-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6 text-purple-700">Informe o endereço de entrega</h1>
        <form onSubmit={handleFinalizar} className="w-full flex flex-col items-center">
          <textarea
            value={endereco}
            onChange={e => setEndereco(e.target.value)}
            placeholder="Rua, número, bairro, cidade"
            rows={4}
            style={{ borderColor: "#8b5cf6", color: "#2d1b69" }}
            className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg mb-6 resize-none"
            required
          />
          <button
            type="submit"
            style={{ background: !endereco ? "#e9d5ff" : "#8b5cf6", color: !endereco ? "#888" : "#fff" }}
            className="w-full py-3 rounded-lg text-lg font-semibold shadow transition hover:brightness-110 disabled:cursor-not-allowed"
            disabled={!endereco}
          >
            Finalizar Pedido
          </button>
        </form>
      </div>
    </div>
  );
}
