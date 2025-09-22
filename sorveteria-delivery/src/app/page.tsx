"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-green-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-purple-700">Sorveteria Delivery</h1>
      <p className="mb-8 text-lg text-gray-700 text-center max-w-md">
        Monte seu sorvete do seu jeito! Clique no botão abaixo para começar seu pedido.
      </p>
      <button
        className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded text-xl font-semibold shadow"
        onClick={() => router.push("/ui/pedido/tamanho")}
      >
        Começar Pedido
      </button>
    </div>
  );
}