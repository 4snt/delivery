"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Sorveteria Delivery
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8">
            Os melhores sorvetes artesanais direto na sua casa!
          </p>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Escolha seus sabores favoritos, personalize com adicionais deliciosos e receba tudo fresquinho em minutos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => router.push("/ui/pedido/tamanho")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl text-xl font-bold shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Fazer Pedido
            </button>
            
            {!session && (
              <button
                onClick={() => router.push("/login")}
                className="bg-white hover:bg-gray-50 text-purple-600 px-8 py-4 rounded-xl text-xl font-bold shadow-xl border-2 border-purple-200 transition-all duration-300 transform hover:scale-105"
              >
                Entrar
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center transform transition-all hover:scale-105">
            <div className="text-5xl mb-4">🍨</div>
            <h3 className="text-2xl font-bold text-purple-700 mb-3">
              Sabores Artesanais
            </h3>
            <p className="text-gray-600">
              Mais de 10 sabores especiais feitos com ingredientes premium
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg text-center transform transition-all hover:scale-105">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold text-purple-700 mb-3">
              Entrega Rápida
            </h3>
            <p className="text-gray-600">
              Seu pedido chega fresquinho em até 30 minutos
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg text-center transform transition-all hover:scale-105">
            <div className="text-5xl mb-4"></div>
            <h3 className="text-2xl font-bold text-purple-700 mb-3">
              Personalize Tudo
            </h3>
            <p className="text-gray-600">
              Adicione coberturas, granulados e muito mais!
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white max-w-4xl mx-auto shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">
            Pronto para se deliciar?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Monte seu sorvete perfeito em apenas alguns cliques!
          </p>
          <button
            onClick={() => router.push("/ui/pedido/tamanho")}
            className="bg-white text-purple-600 px-10 py-4 rounded-xl text-xl font-bold shadow-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
          >
            Começar Agora
          </button>
        </div>
      </section>
    </div>
  );
}