"use client";

interface OrderCardProps {
  id: number;
  customerName: string;
  customerEmail?: string;
  status: string;
  onStatusChange?: (id: number, newStatus: string) => void;
  onDelete?: (id: number) => void;
  onClick?: (id: number) => void;
}

export function OrderCard({
  id,
  customerName,
  customerEmail,
  status,
  onStatusChange,
  onDelete,
  onClick,
}: OrderCardProps) {
  return (
    <div
      className="p-3 border rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-50"
      onClick={() => onClick?.(id)}
    >
      <div>
        <span className="font-medium">
          Pedido #{id} - {customerName}
        </span>
        {customerEmail && (
          <p className="text-sm text-gray-500">Cliente: {customerEmail}</p>
        )}
        <p className="text-sm text-gray-500">Status: {status}</p>
      </div>
      
      {(onStatusChange || onDelete) && (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {onStatusChange && (
            <select
              value={status}
              onChange={(e) => onStatusChange(id, e.target.value)}
              className="border rounded p-1 text-sm"
            >
              <option value="Pendente">Pendente</option>
              <option value="Em preparo">Em preparo</option>
              <option value="Saiu para a entrega">Saiu para a entrega</option>
              <option value="Entregue">Entregue</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          )}
          
          {onDelete && (
            <button
              className="text-red-600 border border-red-200 hover:bg-red-50 rounded px-2 py-1 text-sm"
              title="Remover pedido"
              onClick={() => onDelete(id)}
            >
              Remover
            </button>
          )}
        </div>
      )}
    </div>
  );
}
