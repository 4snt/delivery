-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "pontosFidelidade" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Pedido" ADD COLUMN     "cupomCodigo" TEXT,
ADD COLUMN     "descontoAplicado" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Cupom" (
    "id" BIGSERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT,
    "tipo" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "valorMinimo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "usoMaximo" INTEGER,
    "usosAtuais" INTEGER NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "expiraEm" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cupom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorito" (
    "id" BIGSERIAL NOT NULL,
    "clienteId" BIGINT NOT NULL,
    "nome" TEXT NOT NULL,
    "tamanho" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoritoSabor" (
    "favoritoId" BIGINT NOT NULL,
    "saborId" BIGINT NOT NULL,

    CONSTRAINT "FavoritoSabor_pkey" PRIMARY KEY ("favoritoId","saborId")
);

-- CreateTable
CREATE TABLE "FavoritoAdicional" (
    "favoritoId" BIGINT NOT NULL,
    "adicionalId" BIGINT NOT NULL,

    CONSTRAINT "FavoritoAdicional_pkey" PRIMARY KEY ("favoritoId","adicionalId")
);

-- CreateTable
CREATE TABLE "FidelidadeTransacao" (
    "id" BIGSERIAL NOT NULL,
    "clienteId" BIGINT NOT NULL,
    "tipo" TEXT NOT NULL,
    "pontos" INTEGER NOT NULL,
    "descricao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FidelidadeTransacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cupom_codigo_key" ON "Cupom"("codigo");

-- AddForeignKey
ALTER TABLE "Favorito" ADD CONSTRAINT "Favorito_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoritoSabor" ADD CONSTRAINT "FavoritoSabor_favoritoId_fkey" FOREIGN KEY ("favoritoId") REFERENCES "Favorito"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoritoSabor" ADD CONSTRAINT "FavoritoSabor_saborId_fkey" FOREIGN KEY ("saborId") REFERENCES "Sabor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoritoAdicional" ADD CONSTRAINT "FavoritoAdicional_favoritoId_fkey" FOREIGN KEY ("favoritoId") REFERENCES "Favorito"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoritoAdicional" ADD CONSTRAINT "FavoritoAdicional_adicionalId_fkey" FOREIGN KEY ("adicionalId") REFERENCES "Adicional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FidelidadeTransacao" ADD CONSTRAINT "FidelidadeTransacao_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;
