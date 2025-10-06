"use client";

import { useSession } from "next-auth/react";

export default function ProtectedPage() {
  const { data: session } = useSession();

  if (!session) return <p>Carregando...</p>;

  return (
    <div>
      <h1>Bem-vindo, {session.user.name}!</h1>
      <p>Email: {session.user.email}</p>
      <p>Provedor: {session.account?.provider || "Email/Senha"}</p>
    </div>
  );
}
