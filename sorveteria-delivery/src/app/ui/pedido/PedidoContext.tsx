"use client";
import React, { createContext, useContext, useState } from "react";

interface Pedido {
  tamanho?: string;
  sabores?: string[];
  adicionais?: string[];
  pagamento?: string;
  endereco?: string;
  status: "Em preparo" | "Entregue" | "Cancelado"|"saiu para entrega";
}
  
interface PedidoContextType {
  pedido: Pedido;
  setPedido: React.Dispatch<React.SetStateAction<Pedido>>;
}

const PedidoContext = createContext<PedidoContextType | undefined>(undefined);

export const usePedido = () => {
  const context = useContext(PedidoContext);
  if (!context) throw new Error("usePedido deve ser usado dentro do PedidoProvider");
  return context;
};

export const PedidoProvider = ({ children }: { children: React.ReactNode }) => {
  const [pedido, setPedido] = useState<Pedido>({ status: "Em preparo" });
  return (
    <PedidoContext.Provider value={{ pedido, setPedido }}>
      {children}
    </PedidoContext.Provider>
  );
};
