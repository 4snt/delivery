-- CreateTable
CREATE TABLE "Adicional" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Sabor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "imagem" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "senha" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clienteId" INTEGER NOT NULL,
    "tamanho" TEXT NOT NULL,
    "valorTotal" REAL NOT NULL,
    "formaPagamento" TEXT NOT NULL,
    "enderecoEntrega" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Pedido_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_PedidoAdicionais" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_PedidoAdicionais_A_fkey" FOREIGN KEY ("A") REFERENCES "Adicional" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PedidoAdicionais_B_fkey" FOREIGN KEY ("B") REFERENCES "Pedido" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_PedidoToSabor" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_PedidoToSabor_A_fkey" FOREIGN KEY ("A") REFERENCES "Pedido" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PedidoToSabor_B_fkey" FOREIGN KEY ("B") REFERENCES "Sabor" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
