-- CreateTable
CREATE TABLE "Adicional" (
    "id" BIGSERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Adicional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sabor" (
    "id" BIGSERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "imagem" TEXT NOT NULL,

    CONSTRAINT "Sabor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" BIGSERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "senha" TEXT NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" BIGSERIAL NOT NULL,
    "clienteId" BIGINT NOT NULL,
    "tamanho" TEXT NOT NULL,
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "formaPagamento" TEXT NOT NULL,
    "enderecoEntrega" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PedidoAdicionais" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL
);

-- CreateTable
CREATE TABLE "_PedidoToSabor" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_email_key" ON "Cliente"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_PedidoAdicionais_AB_unique" ON "_PedidoAdicionais"("A", "B");

-- CreateIndex
CREATE INDEX "_PedidoAdicionais_B_index" ON "_PedidoAdicionais"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PedidoToSabor_AB_unique" ON "_PedidoToSabor"("A", "B");

-- CreateIndex
CREATE INDEX "_PedidoToSabor_B_index" ON "_PedidoToSabor"("B");

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PedidoAdicionais" ADD CONSTRAINT "_PedidoAdicionais_A_fkey" FOREIGN KEY ("A") REFERENCES "Adicional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PedidoAdicionais" ADD CONSTRAINT "_PedidoAdicionais_B_fkey" FOREIGN KEY ("B") REFERENCES "Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PedidoToSabor" ADD CONSTRAINT "_PedidoToSabor_A_fkey" FOREIGN KEY ("A") REFERENCES "Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PedidoToSabor" ADD CONSTRAINT "_PedidoToSabor_B_fkey" FOREIGN KEY ("B") REFERENCES "Sabor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
