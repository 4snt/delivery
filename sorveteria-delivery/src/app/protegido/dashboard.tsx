import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto p-8">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">
          Dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h2 className="text-xl font-semibold mb-2 text-blue-800">
              Informações do Usuário
            </h2>
            <div className="space-y-2">
              <p className="text-gray-700">
                <span className="font-medium">Nome:</span> {session.user?.name}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">E-mail:</span> {session.user?.email}
              </p>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h2 className="text-xl font-semibold mb-2 text-green-800">
              Status da Sessão
            </h2>
            <div className="space-y-2">
              <p className="text-gray-700">
                <span className="font-medium">Status:</span>{" "}
                <span className="text-green-600">Ativo</span>
              </p>
              <p className="text-gray-700">
                <span className="font-medium">ID:</span> {(session.user as any)?.id || "N/A"}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Acesso Rápido
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href="/ui/pedido/tamanho"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors"
            >
              Fazer Pedido
            </a>
            <a
              href="/ui/clientes"
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors"
            >
              Meus Pedidos
            </a>
            <a
              href="/ui/admin"
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors"
            >
              Administração
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
