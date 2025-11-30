"use client";
import { usePedido } from "../PedidoContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";

export default function LoginPage() {
  const { pedido, setPedido } = usePedido();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [nome, setNome] = useState(pedido.cliente?.nome || "");
  const [email, setEmail] = useState(pedido.cliente?.email || "");
  const [senha, setSenha] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const total = pedido.potes.reduce((acc, pote) => acc + pote.preco, 0);
  const isAuthenticated = status === "authenticated";
  const canContinue = isAuthenticated && !!nome && !!email;

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
    if (!isAuthenticated) {
      setAuthError("Faça login (Google ou email/senha) para continuar.");
      return;
    }
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

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLoadingAuth(true);
    if (!email || !senha) {
      setAuthError("Preencha email e senha para entrar.");
      setLoadingAuth(false);
      return;
    }
    const result = await signIn("credentials", {
      email,
      senha,
      redirect: false,
    });
    if (result?.error) {
      setAuthError("Login com email/senha falhou. Verifique as credenciais.");
    }
    setLoadingAuth(false);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-10 flex items-center justify-center">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden grid md:grid-cols-2">
        {/* Resumo */}
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white p-8 space-y-4">
          <div>
            <p className="text-sm text-purple-100">Etapa 3 de 4</p>
            <h1 className="text-3xl font-bold">Revise e entre</h1>
            <p className="text-purple-50 mt-2">Faça login para finalizar seu pedido.</p>
          </div>
          <div className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur">
            <h2 className="text-lg font-semibold mb-3">Resumo</h2>
            <div className="space-y-2 text-sm">
              {pedido.potes.map((pote, idx) => (
                <div key={idx} className="border-b border-white/20 pb-2 last:border-0">
                  <p className="font-semibold">Pote {idx + 1} · {pote.tamanho}</p>
                  <p className="text-purple-50">Sabores: {pote.sabores.map((s) => s.nome).join(", ")}</p>
                  <p className="text-purple-50">Adicionais: {pote.adicionais?.length ? pote.adicionais.map((a) => a.nome).join(", ") : "Nenhum"}</p>
                  <p className="text-green-100 font-semibold">R$ {pote.preco.toFixed(2)}</p>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm">Total</span>
                <span className="text-xl font-bold text-green-200">R$ {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Login */}
        <div className="p-8 space-y-5">
          <h2 className="text-2xl font-bold text-purple-800">Identifique-se</h2>
          <p className="text-sm text-gray-600">
            Passos: (1) Faça login (email/senha ou Google). (2) Confirme nome e email. (3) Continue.
          </p>
          <div className="space-y-3 bg-gray-50 border border-gray-200 rounded-2xl p-4">
            <p className="text-sm font-semibold text-gray-700">Entrar</p>
            <form onSubmit={handleCredentialsLogin} className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-base bg-white"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Senha</label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="mt-2 w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-base bg-white"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl text-lg font-semibold shadow transition bg-gray-900 text-white disabled:opacity-70"
                disabled={loadingAuth}
              >
                {loadingAuth ? "Entrando..." : "Entrar com email e senha"}
              </button>
            </form>
            <div className="relative pt-3">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-50 px-2 text-gray-500">ou</span>
              </div>
            </div>
            <button
              onClick={() => signIn("google", { callbackUrl: "/ui/pedido/pagamento", redirect: true })}
              className="w-full py-3 rounded-xl text-lg font-semibold shadow transition bg-red-500 text-white hover:bg-red-600"
            >
              Entrar com Google
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">Nome</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome"
                  className="mt-2 w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-base bg-gray-50"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="mt-2 w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-base bg-gray-50"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl text-lg font-semibold shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed bg-gradient-to-r from-purple-600 to-pink-600 text-white disabled:from-gray-300 disabled:to-gray-400"
              disabled={!canContinue}
            >
              {canContinue ? "Continuar" : "Faça login para continuar"}
            </button>
          </form>
          {authError && (
            <p className="text-sm text-red-600">{authError}</p>
          )}
          {status === "authenticated" && (
            <p className="text-sm text-green-700">
              Login confirmado para {session.user?.email}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
