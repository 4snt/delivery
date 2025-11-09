"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      try {
        // Verificar se o usuário está logado e é admin
        const response = await fetch("/api/auth/session");
        const session = await response.json();

        if (!session || !session.user || !session.user.isAdmin) {
          router.push("/");
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("Erro ao verificar admin:", error);
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    }

    checkAdmin();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
