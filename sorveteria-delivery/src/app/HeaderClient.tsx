"use client";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function HeaderClient() {
  const { data: session } = useSession();
  return (
    <header style={{ background: "var(--primary)", color: "#fff" }} className="w-full flex items-center px-4 py-2 shadow-md sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2">
        <img
          src="/logo acai sem fundo.png"
          alt="Logo Açaí do Vale"
          style={{ width: 48, height: 48, objectFit: "contain", borderRadius: 12}}
        />
      </Link>
      <nav className="flex gap-4 ml-6">
        <Link href="/" className="hover:underline font-semibold">Início</Link>
        <Link href="/ui/pedido/tamanho" className="hover:underline font-semibold">Pedido</Link>
        
        <Link href="/ui/admin" className="hover:underline font-semibold">Admin</Link>
        <a href="mailto:contato@acai.com" className="hover:underline font-semibold">Contato</a>
        <Link href="/ui/cliente/login" className="hover:underline font-semibold">Login</Link>
        <Link href="/ui/cliente/cadastro" className="hover:underline font-semibold">Cadastro</Link>
      </nav>
      <div className="ml-auto flex items-center gap-3">
        {session?.user ? (
          <>
            <span className="text-sm">{session.user.name || session.user.email}</span>
            <button onClick={()=>signOut({ callbackUrl: "/ui/cliente/login" })} className="px-3 py-1 rounded bg-white/20">Sair</button>
          </>
        ) : (
          <>
            <Link href="/ui/cliente/login" className="px-3 py-1 rounded bg-white/20">Entrar</Link>
            <button onClick={()=>signIn('google')} className="px-3 py-1 rounded bg-white/20">Google</button>
          </>
        )}
      </div>
    </header>
  );
}


