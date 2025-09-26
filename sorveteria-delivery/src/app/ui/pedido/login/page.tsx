"use client";
import { usePedido } from "../PedidoContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginPage() {
  const { pedido, setPedido } = usePedido();
  const router = useRouter();
  const { data: session } = useSession();
  const [nome, setNome] = useState(pedido.cliente?.nome || "");
  const [email, setEmail] = useState(pedido.cliente?.email || "");
  const total = pedido.potes.reduce((acc, pote) => acc + pote.preco, 0);

  useEffect(() => {
    if (session?.user) {
      const sNome = session.user.name || "";
      const sEmail = session.user.email || "";
      setNome(prev => prev || sNome);
      setEmail(prev => prev || sEmail);
      setPedido(prev => ({ ...prev, cliente: { ...prev.cliente, nome: sNome || prev.cliente.nome, email: sEmail || prev.cliente.email } }));
    }
  }, [session, setPedido]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email) return;
    setPedido(prev => ({
      ...prev,
      cliente: {
        ...prev.cliente,
        nome,
        email,
      },
    }));
    router.push("/ui/pedido/pagamento");
  };

  if (pedido.potes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-green-100 p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold mb-4 text-purple-700">Seu carrinho está vazio</h1>
          <p className="text-gray-600 mb-6">Adicione um sorvete para continuar.</p>
          <button
            onClick={() => router.push("/ui/pedido/tamanho")}
            className="w-full py-3 rounded-lg text-lg font-semibold shadow transition"
            style={{ background: "#8b5cf6", color: "#fff" }}
          >
            Começar pedido
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-green-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-purple-700">Identifique-se</h1>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-purple-700 mb-2">Resumo do pedido</h2>
          <ul className="text-sm text-gray-700 mb-3">
            {pedido.potes.map((pote, idx) => (
              <li key={idx} className="mb-2">
                <b>Pote {idx + 1}:</b> {pote.tamanho} - R$ {pote.preco.toFixed(2)}<br />
                <b>Sabores:</b> {pote.sabores.join(", ")}<br />
                <b>Adicionais:</b> {pote.adicionais?.length ? pote.adicionais.join(", ") : "Nenhum"}
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center">
            <span className="font-bold">Total:</span>
            <span className="text-xl font-bold text-green-600">R$ {total.toFixed(2)}</span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Seu nome"
            className="p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu e-mail"
            className="p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <button
            type="submit"
            className="w-full py-3 rounded-lg text-lg font-semibold shadow transition"
            style={{ background: nome && email ? "#8b5cf6" : "#e9d5ff", color: nome && email ? "#fff" : "#888" }}
            disabled={!nome || !email}
          >
            Continuar
          </button>
        </form>
        <div className="mt-6">
          <button
            onClick={() => signIn("google", { callbackUrl: "/ui/pedido/pagamento", redirect: true })}
            className="w-full py-3 rounded-lg text-lg font-semibold shadow transition"
            style={{ background: "#db4437", color: "#fff" }}
          >
            Entrar com Google
          </button>
          <div className="mt-3 text-center text-sm text-gray-500">
            <a href="/api/auth/signin/google" className="underline">Tentar login via link direto</a>
          </div>
        </div>
      </div>
    </div>
  );
}


