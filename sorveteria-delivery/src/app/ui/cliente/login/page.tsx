"use client";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { usePedido } from "../../pedido/PedidoContext";
import { useState } from "react";
import { useAuthToken } from "@/src/app/AuthTokenProvider";

export default function LoginClientePage() {
  const router = useRouter();
  const { setPedido } = usePedido();
  const { setToken } = useAuthToken();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const res = await fetch(`/api/clientes?email=${encodeURIComponent(email)}`);
    const cliente = await res.json();
    if (cliente && cliente.email) {
      setPedido(prev => ({ ...prev, cliente }));
      const jwtRes = await fetch('/api/jwt/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: cliente.email, nome: cliente.nome }) });
      const { token } = await jwtRes.json();
      if (token) setToken(token);
      router.push('/ui/pedido/tamanho');
    } else {
      router.push('/ui/cliente/cadastro');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-green-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-purple-700">Entrar</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input type="email" className="p-3 rounded-lg border" placeholder="Seu email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <button className="w-full py-3 rounded-lg text-lg font-semibold" style={{ background: email ? "#8b5cf6" : "#e9d5ff", color: email ? "#fff" : "#888" }} disabled={!email || loading}>
            Continuar
          </button>
        </form>
        <div className="mt-6">
          <button onClick={()=>signIn('google', { callbackUrl: '/ui/pedido/tamanho' })} className="w-full py-3 rounded-lg text-lg font-semibold" style={{ background: "#db4437", color: "#fff" }}>
            Entrar com Google
          </button>
        </div>
        <div className="mt-4 text-center text-sm">
          <a href="/ui/cliente/cadastro" className="underline">Não tem conta? Cadastre-se</a>
        </div>
      </div>
    </div>
  );
}


