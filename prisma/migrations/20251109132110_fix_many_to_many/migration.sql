/*
  Warnings:

  - You are about to drop the `_PedidoAdicionais` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PedidoToSabor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_PedidoAdicionais";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_PedidoToSabor";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "PedidoSabor" (
    "pedidoId" INTEGER NOT NULL,
    "saborId" INTEGER NOT NULL,

    PRIMARY KEY ("pedidoId", "saborId"),
    CONSTRAINT "PedidoSabor_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PedidoSabor_saborId_fkey" FOREIGN KEY ("saborId") REFERENCES "Sabor" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PedidoAdicional" (
    "pedidoId" INTEGER NOT NULL,
    "adicionalId" INTEGER NOT NULL,

    PRIMARY KEY ("pedidoId", "adicionalId"),
    CONSTRAINT "PedidoAdicional_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PedidoAdicional_adicionalId_fkey" FOREIGN KEY ("adicionalId") REFERENCES "Adicional" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
