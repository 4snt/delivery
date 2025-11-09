"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

interface AuthTokenContextType {
  token: string | null;
  setToken: (t: string | null) => void;
  email: string | null;
  nome: string | null;
  logout: () => void;
}

interface JwtPayload {
  email: string;
  nome?: string;
}

const AuthTokenContext = createContext<AuthTokenContextType | undefined>(undefined);

export function useAuthToken() {
  const ctx = useContext(AuthTokenContext);
  if (!ctx) throw new Error("useAuthToken deve ser usado dentro de AuthTokenProvider");
  return ctx;
}

// Função client-side para decodificar JWT (sem verificação de assinatura)
function decodeJwtClient(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload as JwtPayload;
  } catch {
    return null;
  }
}

export default function AuthTokenProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    const existing = typeof window !== 'undefined' ? localStorage.getItem('cliente.jwt') : null;
    if (existing) setTokenState(existing);
  }, []);

  const setToken = (t: string | null) => {
    setTokenState(t);
    if (typeof window === 'undefined') return;
    if (t) localStorage.setItem('cliente.jwt', t);
    else localStorage.removeItem('cliente.jwt');
  };

  const decoded = useMemo(() => (token ? decodeJwtClient(token) : null), [token]);
  const email = decoded?.email || null;
  const nome = decoded?.nome || null;

  const logout = () => setToken(null);

  return (
    <AuthTokenContext.Provider value={{ token, setToken, email, nome, logout }}>
      {children}
    </AuthTokenContext.Provider>
  );
}


