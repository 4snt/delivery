"use client";
import { usePedido } from "../PedidoContext";
import { useRouter } from "next/navigation";

const tamanhos = [
  { label: "Pequeno (300ml)", value: "pequeno" },
  { label: "Médio (500ml)", value: "medio" },
  { label: "Grande (700ml)", value: "grande" },
];

export default function TamanhoPage() {
  const { setPedido } = usePedido();
  const router = useRouter();

  const handleSelect = (tamanho: string) => {
    setPedido((prev) => ({ ...prev, tamanho }));
    router.push("/ui/pedido/sabores");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-green-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6 text-purple-700">Selecione o tamanho do sorvete</h1>
        <div className="flex flex-col gap-4 w-full">
          {tamanhos.map((t) => (
            <button
              key={t.value}
              onClick={() => handleSelect(t.value)}
              style={{ background: "#8b5cf6", color: "#fff" }}
              className="py-4 px-6 hover:brightness-110 rounded-lg text-lg font-semibold shadow transition"
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
