"use client";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HeaderClient() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl"></span>
            </div>
            <span className="font-bold text-xl hidden sm:block">Sorveteria</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="hover:text-purple-200 transition-colors font-medium">
              Início
            </Link>
            <Link href="/ui/pedido/tamanho" className="hover:text-purple-200 transition-colors font-medium">
              Fazer Pedido
            </Link>
            {session && (
              <Link href="/protegido/dashboard" className="hover:text-purple-200 transition-colors font-medium">
                Dashboard
              </Link>
            )}
            {(session?.user as any)?.isAdmin && (
              <Link href="/dashboard" className="hover:text-purple-200 transition-colors font-medium bg-white/20 px-3 py-1 rounded-lg">
                🛠️ Admin
              </Link>
            )}
          </nav>

          {/* User Menu - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {session?.user ? (
              <>
                <span className="text-sm text-purple-100">
                  Olá, {session.user.name?.split(' ')[0] || 'Usuário'}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all font-medium"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push("/login")}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all font-medium"
                >
                  Entrar
                </button>
                <button
                  onClick={() => router.push("/ui/cliente/cadastro")}
                  className="bg-white hover:bg-gray-100 text-purple-600 px-4 py-2 rounded-lg transition-all font-medium"
                >
                  Cadastrar
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-purple-500 mt-2 pt-4">
            <nav className="flex flex-col gap-3">
              <Link
                href="/"
                className="hover:text-purple-200 transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Início
              </Link>
              <Link
                href="/ui/pedido/tamanho"
                className="hover:text-purple-200 transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Fazer Pedido
              </Link>
              {session && (
                <Link
                  href="/protegido/dashboard"
                  className="hover:text-purple-200 transition-colors font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              {(session?.user as any)?.isAdmin && (
                <Link
                  href="/dashboard"
                  className="hover:text-purple-200 transition-colors font-medium py-2 bg-white/20 px-3 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🛠️ Admin
                </Link>
              )}
              <div className="border-t border-purple-500 pt-3 mt-2">
                {session?.user ? (
                  <>
                    <p className="text-sm text-purple-100 mb-3">
                      {session.user.name || session.user.email}
                    </p>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="w-full bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all font-medium"
                    >
                      Sair
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        router.push("/login");
                      }}
                      className="w-full bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all font-medium"
                    >
                      Entrar
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        router.push("/ui/cliente/cadastro");
                      }}
                      className="w-full bg-white hover:bg-gray-100 text-purple-600 px-4 py-2 rounded-lg transition-all font-medium"
                    >
                      Cadastrar
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}


