"use client";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import AuthTokenProvider from "./AuthTokenProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthTokenProvider>
        {children}
      </AuthTokenProvider>
    </SessionProvider>
  );
}


