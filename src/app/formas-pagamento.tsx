"use client";
import { useEffect, useState } from "react";

interface FormaPagamento {
  id: number;
  nome: string;
}

export default function FormasPagamento() {
  const [formas, setFormas] = useState<FormaPagamento[]>([]);
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/formasPagamento")
      .then((res) => res.json())
      .then((data) => {
        setFormas(data);
        setLoading(false);
      });
  }, []);

  const cadastrar = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/formasPagamento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome }),
    });
    const nova = await res.json();
    setFormas((prev) => [...prev, nova]);
    setNome("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-pink-100 p-4">
      <h1 className="text-2xl font-bold mb-6 text-pink-700">Formas de Pagamento</h1>
      <form onSubmit={cadastrar} className="bg-white rounded-lg shadow p-6 mb-8 w-full max-w-md flex flex-col gap-4">
        <input
          className="border p-2 rounded"
          placeholder="Nome da forma de pagamento"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <button className="bg-green-500 hover:bg-green-600 text-white py-2 rounded" type="submit">
          Cadastrar
        </button>
      </form>
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Lista de Formas de Pagamento</h2>
        {loading ? (
          <p>Carregando...</p>
        ) : formas.length === 0 ? (
          <p className="text-gray-500">Nenhuma forma cadastrada.</p>
        ) : (
          <ul className="space-y-2">
            {formas.map((f) => (
              <li key={f.id} className="flex justify-between border-b pb-1">
                <span>{f.nome}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
