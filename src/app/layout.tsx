import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PedidoProvider } from "./ui/pedido/PedidoContext";
import Providers from "@/app/providers";
import Link from "next/link";
import React from "react";
import HeaderClient from "./HeaderClient";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Açai do Vale - Delivery",
  description: "Os melhores açaís e sorvetes artesanais direto na sua casa!",
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

function Header() {
  return <HeaderClient />;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          <PedidoProvider>
            <Header />
            {children}
          </PedidoProvider>
        </Providers>
      </body>
    </html>
  );
}
