/*
  Warnings:

  - You are about to drop the column `tipoVenta` on the `Venta` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Venta" DROP COLUMN "tipoVenta",
ADD COLUMN     "serieId" TEXT;

-- CreateTable
CREATE TABLE "Serie" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "serie" TEXT NOT NULL,
    "contador" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Serie_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "Serie"("id") ON DELETE SET NULL ON UPDATE CASCADE;
