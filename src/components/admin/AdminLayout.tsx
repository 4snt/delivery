"use client";

import { ReactNode } from "react";
import Link from "next/link";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Painel Administrativo
            </h1>
            <nav className="flex gap-4">
              <Link
                href="/(admin)/dashboard"
                className="text-gray-600 hover:text-gray-900"
              >
                Dashboard
              </Link>
              <a
                href="http://localhost:5555"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-900"
                title="Abrir Prisma Studio"
              >
                🗄️ DB Studio
              </a>
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Sair
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © 2025 Sorveteria Delivery - Painel Admin
          </p>
        </div>
      </footer>
    </div>
  );
}
