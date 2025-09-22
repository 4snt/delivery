import { useEffect, useState } from 'react';

interface Pedido {
  id: number;
  status: string;
  [key: string]: any;
}

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/pedidos')
      .then(res => res.json())
      .then(data => {
        setPedidos(data);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Pedidos Concluídos</h1>
      {loading ? (
        <p>Carregando...</p>
      ) : pedidos.length === 0 ? (
        <p>Nenhum pedido encontrado.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Dados</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map(pedido => (
              <tr key={pedido.id}>
                <td>{pedido.id}</td>
                <td>{pedido.status}</td>
                <td>
                  <pre style={{ margin: 0, fontSize: 12 }}>{JSON.stringify(pedido, null, 2)}</pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
