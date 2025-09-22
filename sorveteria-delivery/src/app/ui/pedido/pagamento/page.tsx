"use client";
import { usePedido } from "../PedidoContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formasPagamento = [
  { label: "Dinheiro", value: "dinheiro" },
  { label: "Cartão de Crédito", value: "credito" },
  { label: "Cartão de Débito", value: "debito" },
  { label: "Pix", value: "pix" },
];

export default function PagamentoPage() {
  const { pedido, setPedido } = usePedido();
  const router = useRouter();
  const [selecionada, setSelecionada] = useState<string>(pedido.pagamento || "");

  const handleSelect = (forma: string) => {
    setSelecionada(forma);
  };

  const handleAvancar = () => {
    if (!selecionada) return;
    setPedido((prev) => ({ ...prev, pagamento: selecionada }));
    router.push("/ui/pedido/endereco");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-green-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6 text-purple-700">Selecione a forma de pagamento</h1>
        <div className="flex flex-col gap-4 w-full mb-6">
          {formasPagamento.map((f) => (
            <button
              key={f.value}
              onClick={() => handleSelect(f.value)}
              style={{ background: selecionada === f.value ? "#7c3aed" : "#8b5cf6", color: "#fff" }}
              className="py-4 px-6 rounded-lg text-lg font-semibold shadow transition w-full hover:brightness-110"
            >
              {f.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleAvancar}
          disabled={!selecionada}
          style={{ background: !selecionada ? "#e9d5ff" : "#8b5cf6", color: !selecionada ? "#888" : "#fff" }}
          className="w-full py-3 rounded-lg text-lg font-semibold shadow transition hover:brightness-110 disabled:cursor-not-allowed"
        >
          Avançar
        </button>
      </div>
    </div>
  );
}
