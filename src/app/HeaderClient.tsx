"use client";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { usePedido } from "./ui/pedido/PedidoContext";
import dynamic from "next/dynamic";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIceCream, faShoppingCart, faUserShield } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

const CartDropdown = dynamic(() => import("@/app/components/CartDropdown"), { ssr: false });

export default function HeaderClient() {
  const { data: session } = useSession();
  const router = useRouter();
  const { pedido } = usePedido();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const itensCarrinho = useMemo(() => pedido.potes.length, [pedido.potes.length]);

  const CartBadge = () => (
    <span className="relative inline-flex items-center gap-2">
      <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/20">
        <svg
          className="w-5 h-5 text-white"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 6H4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M8 6H21L19 14H9L8 6Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 18.5C10 19.3284 9.32843 20 8.5 20C7.67157 20 7 19.3284 7 18.5C7 17.6716 7.67157 17 8.5 17C9.32843 17 10 17.6716 10 18.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M18 18.5C18 19.3284 17.3284 20 16.5 20C15.6716 20 15 19.3284 15 18.5C15 17.6716 15.6716 17 16.5 17C17.3284 17 18 17.6716 18 18.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M9 14L8 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M19 14L21 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {itensCarrinho > 0 && (
        <span className="absolute -right-2 -top-1 inline-flex h-5 min-w-5 px-2 items-center justify-center rounded-full bg-white text-purple-700 text-xs font-bold">
          {itensCarrinho}
        </span>
      )}
    </span>
  );

  return (
    <header className="bg-gradient-to-r from-purple-500/90 via-pink-400/80 to-orange-300/80 backdrop-blur text-white shadow-lg sticky top-0 z-[60]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image 
              src="/logo.png" 
              alt="Açai do Vale" 
              width={42} 
              height={42}
              className="object-contain drop-shadow-lg"
              priority
            />
            <span className="font-bold text-xl hidden sm:block drop-shadow-sm">Açai do Vale</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="hover:text-purple-200 transition-colors font-medium">
              Início
            </Link>
            <Link href="/ui/pedido/tamanho" className="hover:text-purple-200 transition-colors font-medium">
              Fazer Pedido
            </Link>
            <Link href="/pedidos/acompanhar" className="hover:text-purple-200 transition-colors font-medium">
              Acompanhar
            </Link>
            <div
              className="relative flex items-center gap-2"
              onMouseEnter={() => setCartOpen(true)}
              onMouseLeave={() => setCartOpen(false)}
            >
              <Link href="/ui/pedido/carrinho" className="hover:text-purple-200 transition-colors font-medium flex items-center gap-2">
                <CartBadge />
                <span>Carrinho</span>
              </Link>
              {cartOpen && (
                <div className="absolute right-0 top-full pt-3">
                  <CartDropdown onClose={() => setCartOpen(false)} />
                </div>
              )}
            </div>
            {(session?.user as any)?.isAdmin && (
              <>
                <Link
                  href="/dashboard"
                  className="hover:text-purple-200 transition-colors font-medium bg-white/20 px-3 py-1 rounded-lg flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faUserShield} className="text-sm" />
                  Admin
                </Link>
                <Link
                  href="/dashboard/pedidos"
                  className="hover:text-purple-200 transition-colors font-medium"
                >
                  Pedidos
                </Link>
              </>
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

          {/* Mobile CTAs */}
          <div className="md:hidden flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setCartOpen((prev) => !prev)}
                aria-label="Carrinho"
                className="p-1"
              >
                <CartBadge />
              </button>
              {cartOpen && (
                <div className="absolute right-0 top-full pt-2">
                  <CartDropdown onClose={() => setCartOpen(false)} />
                </div>
              )}
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
              aria-label="Menu"
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
              <Link
                href="/pedidos/acompanhar"
                className="hover:text-purple-200 transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Acompanhar
              </Link>
              <Link
                href="/ui/pedido/carrinho"
                className="hover:text-purple-200 transition-colors font-medium py-2 flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/20">
                  <FontAwesomeIcon icon={faShoppingCart} />
                </span>
                Carrinho
                {itensCarrinho > 0 && (
                  <span className="inline-flex h-5 min-w-5 px-2 items-center justify-center rounded-full bg-white text-purple-700 text-xs font-bold">
                    {itensCarrinho}
                  </span>
                )}
              </Link>
              {(session?.user as any)?.isAdmin && (
                <Link
                  href="/dashboard"
                  className="hover:text-purple-200 transition-colors font-medium py-2 bg-white/20 px-3 rounded-lg flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FontAwesomeIcon icon={faUserShield} />
                  Admin
                </Link>
              )}
              {(session?.user as any)?.isAdmin && (
                <Link
                  href="/dashboard/pedidos"
                  className="hover:text-purple-200 transition-colors font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pedidos
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
