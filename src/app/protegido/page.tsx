"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="container mx-auto p-8">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Bem-vindo, {session.user?.name}!
        </h1>
        <div className="space-y-4">
          <div className="border-b pb-4">
            <p className="text-sm text-gray-600">Email</p>
            <p className="text-lg text-gray-800">{session.user?.email}</p>
          </div>
          <div className="border-b pb-4">
            <p className="text-sm text-gray-600">Provedor de Autenticação</p>
            <p className="text-lg text-gray-800">
              {(session as any).account?.provider || "Email/Senha"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
