"use client";
import React, { createContext, useContext, useState } from "react";

// Produto representa um sorvete (pote) com seus itens
export interface Produto {
  tamanho: string;
  preco: number;
  sabores: string[];
  adicionais?: string[];
}

export interface Pedido {
  potes: Produto[];
  pagamento?: string;
  status: "Em preparo" | "Entregue" | "Cancelado" | "saiu para entrega";
  endereco?: string;
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
}

const PedidoContext = createContext<PedidoContextType | undefined>(undefined);

export const usePedido = () => {
  const context = useContext(PedidoContext);
  if (!context) throw new Error("usePedido deve ser usado dentro do PedidoProvider");
  return context;
};

export const PedidoProvider = ({ children }: { children: React.ReactNode }) => {
  const [pedido, setPedido] = useState<Pedido>({ potes: [], status: "Em preparo", cliente: { nome: "", email: "", endereco: "" }, data: new Date().toISOString() });

  const adicionarPote = (pote: Produto) => setPedido(prev => ({ ...prev, potes: [...prev.potes, pote] }));
  const removerPote = (index: number) => setPedido(prev => ({ ...prev, potes: prev.potes.filter((_, i) => i !== index) }));
  const limparPotes = () => setPedido(prev => ({ ...prev, potes: [] }));

  return (
    <PedidoContext.Provider value={{ pedido, setPedido, adicionarPote, removerPote, limparPotes }}>
      {children}
    </PedidoContext.Provider>
  );
};
