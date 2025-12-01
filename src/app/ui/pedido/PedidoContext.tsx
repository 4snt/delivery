"use client";
import React, { createContext, useContext, useState } from "react";
import { useEffect } from "react";

// Produto representa um sorvete (pote) com seus itens
export interface SaborSelecionado {
  id: number;
  nome: string;
}

export interface AdicionalSelecionado {
  id: number;
  nome: string;
}

export interface Produto {
  tamanho: string;
  preco: number;
  sabores: SaborSelecionado[];
  adicionais?: AdicionalSelecionado[];
}

export interface Pedido {
  potes: Produto[];
  pagamento?: string;
  status: "Em preparo" | "Entregue" | "Cancelado" | "saiu para entrega";
  endereco?: string;
  cupom?: {
    codigo: string;
    desconto: number;
    tipo: "percentual" | "valor_fixo";
    valor: number;
  } | null;
  desconto?: number;
  cliente: Cliente;
  data: string;
}

export interface Cliente {
  nome: string;
  email: string;
  endereco: string;
}

interface PedidoContextType {
  pedido: Pedido;
  setPedido: React.Dispatch<React.SetStateAction<Pedido>>;
  adicionarPote: (pote: Produto) => void;
  removerPote: (index: number) => void;
  limparPotes: () => void;
  aplicarCupom: (cupom: Pedido["cupom"]) => void;
  removerCupom: () => void;
}

const PedidoContext = createContext<PedidoContextType | undefined>(undefined);
const STORAGE_KEY = "pedido-atual";

export const usePedido = () => {
  const context = useContext(PedidoContext);
  if (!context) throw new Error("usePedido deve ser usado dentro do PedidoProvider");
  return context;
};

export const PedidoProvider = ({ children }: { children: React.ReactNode }) => {
  const [pedido, setPedido] = useState<Pedido>({
    potes: [],
    status: "Em preparo",
    cupom: null,
    desconto: 0,
    cliente: { nome: "", email: "", endereco: "" },
    data: "",
  });

  // Carrega do localStorage na montagem
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.potes) {
          setPedido(parsed);
        }
      }
    } catch (err) {
      console.warn("Não foi possível carregar o carrinho salvo", err);
    }
    if (!pedido.data) {
      setPedido((prev) => ({ ...prev, data: new Date().toISOString() }));
    }
  }, []);

  // Persiste mudanças
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(pedido));
  }, [pedido]);

  const adicionarPote = (pote: Produto) => setPedido(prev => ({ ...prev, potes: [...prev.potes, pote] }));
  const removerPote = (index: number) => setPedido(prev => ({ ...prev, potes: prev.potes.filter((_, i) => i !== index) }));
  const limparPotes = () => setPedido(prev => ({ ...prev, potes: [] }));
  const aplicarCupom = (cupom: Pedido["cupom"]) => setPedido(prev => ({ ...prev, cupom, desconto: cupom?.desconto || 0 }));
  const removerCupom = () => setPedido(prev => ({ ...prev, cupom: null, desconto: 0 }));

  return (
    <PedidoContext.Provider value={{ pedido, setPedido, adicionarPote, removerPote, limparPotes, aplicarCupom, removerCupom }}>
      {children}
    </PedidoContext.Provider>
  );
};
