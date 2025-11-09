/*
  Warnings:

  - You are about to drop the `_PedidoAdicionais` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PedidoToSabor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PedidoAdicionais" DROP CONSTRAINT "_PedidoAdicionais_A_fkey";

-- DropForeignKey
ALTER TABLE "_PedidoAdicionais" DROP CONSTRAINT "_PedidoAdicionais_B_fkey";

-- DropForeignKey
ALTER TABLE "_PedidoToSabor" DROP CONSTRAINT "_PedidoToSabor_A_fkey";

-- DropForeignKey
ALTER TABLE "_PedidoToSabor" DROP CONSTRAINT "_PedidoToSabor_B_fkey";

-- DropTable
DROP TABLE "_PedidoAdicionais";

-- DropTable
DROP TABLE "_PedidoToSabor";

-- CreateTable
CREATE TABLE "PedidoSabor" (
    "pedidoId" BIGINT NOT NULL,
    "saborId" BIGINT NOT NULL,

    CONSTRAINT "PedidoSabor_pkey" PRIMARY KEY ("pedidoId","saborId")
);

-- CreateTable
CREATE TABLE "PedidoAdicional" (
    "pedidoId" BIGINT NOT NULL,
    "adicionalId" BIGINT NOT NULL,

    CONSTRAINT "PedidoAdicional_pkey" PRIMARY KEY ("pedidoId","adicionalId")
);

-- AddForeignKey
ALTER TABLE "PedidoSabor" ADD CONSTRAINT "PedidoSabor_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoSabor" ADD CONSTRAINT "PedidoSabor_saborId_fkey" FOREIGN KEY ("saborId") REFERENCES "Sabor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoAdicional" ADD CONSTRAINT "PedidoAdicional_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoAdicional" ADD CONSTRAINT "PedidoAdicional_adicionalId_fkey" FOREIGN KEY ("adicionalId") REFERENCES "Adicional"("id") ON DELETE CASCADE ON UPDATE CASCADE;
