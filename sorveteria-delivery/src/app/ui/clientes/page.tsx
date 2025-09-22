"use client";
import { useEffect, useState } from "react";

interface Cliente {
  id: number;
  nome: string;
  telefone: string;
}

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/clientes")
      .then((res) => res.json())
      .then((data) => {
        setClientes(data);
        setLoading(false);
      });
  }, []);

  const cadastrar = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, telefone }),
    });
    const novo = await res.json();
    setClientes((prev) => [...prev, novo]);
    setNome("");
    setTelefone("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-pink-100 p-4">
      <h1 className="text-2xl font-bold mb-6 text-pink-700">Clientes</h1>
      <form onSubmit={cadastrar} className="bg-white rounded-lg shadow p-6 mb-8 w-full max-w-md flex flex-col gap-4">
        <input
          className="border p-2 rounded"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <input
          className="border p-2 rounded"
          placeholder="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          required
        />
        <button className="bg-green-500 hover:bg-green-600 text-white py-2 rounded" type="submit">
          Cadastrar
        </button>
      </form>
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Lista de Clientes</h2>
        {loading ? (
          <p>Carregando...</p>
        ) : clientes.length === 0 ? (
          <p className="text-gray-500">Nenhum cliente cadastrado.</p>
        ) : (
          <ul className="space-y-2">
            {clientes.map((c) => (
              <li key={c.id} className="flex justify-between border-b pb-1">
                <span>{c.nome}</span>
                <span className="text-gray-500">{c.telefone}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
