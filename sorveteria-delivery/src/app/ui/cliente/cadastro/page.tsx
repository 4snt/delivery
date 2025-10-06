"use client";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { usePedido } from "../../pedido/PedidoContext";
import { useState } from "react";
import { useAuthToken } from "@/app/AuthTokenProvider";

export default function CadastroClientePage() {
  const router = useRouter();
  const { pedido, setPedido } = usePedido();
  const { setToken } = useAuthToken();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [endereco, setEndereco] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email) return;
    const cliente = { nome, email, endereco };
    await fetch('/api/clientes', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cliente) });
    const jwtRes = await fetch('/api/jwt/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, nome }) });
    const { token } = await jwtRes.json();
    if (token) setToken(token);
    setPedido(prev => ({ ...prev, cliente }));
    router.push("/ui/pedido/tamanho");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-green-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-purple-700">Cadastrar Cliente</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input className="p-3 rounded-lg border" placeholder="Nome" value={nome} onChange={e=>setNome(e.target.value)} required />
          <input type="email" className="p-3 rounded-lg border" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <textarea className="p-3 rounded-lg border" placeholder="Endereço (opcional)" rows={3} value={endereco} onChange={e=>setEndereco(e.target.value)} />
          <button className="w-full py-3 rounded-lg text-lg font-semibold" style={{ background: nome && email ? "#8b5cf6" : "#e9d5ff", color: nome && email ? "#fff" : "#888" }} disabled={!nome || !email}>
            Salvar cadastro
          </button>
        </form>
        <div className="mt-6">
          <button onClick={()=>signIn('google', { callbackUrl: '/ui/pedido/tamanho' })} className="w-full py-3 rounded-lg text-lg font-semibold" style={{ background: "#db4437", color: "#fff" }}>
            Cadastrar com Google
          </button>
        </div>
      </div>
    </div>
  );
}


