-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Pedido" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'Pendente';
