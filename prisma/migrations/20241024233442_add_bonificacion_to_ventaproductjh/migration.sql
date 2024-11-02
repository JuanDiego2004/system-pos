/*
  Warnings:

  - You are about to drop the column `bonificacion` on the `VentaProducto` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "VentaProducto" DROP COLUMN "bonificacion";

-- CreateTable
CREATE TABLE "_BonificacionToVenta" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BonificacionToVenta_AB_unique" ON "_BonificacionToVenta"("A", "B");

-- CreateIndex
CREATE INDEX "_BonificacionToVenta_B_index" ON "_BonificacionToVenta"("B");

-- AddForeignKey
ALTER TABLE "_BonificacionToVenta" ADD CONSTRAINT "_BonificacionToVenta_A_fkey" FOREIGN KEY ("A") REFERENCES "Bonificacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BonificacionToVenta" ADD CONSTRAINT "_BonificacionToVenta_B_fkey" FOREIGN KEY ("B") REFERENCES "Venta"("id") ON DELETE CASCADE ON UPDATE CASCADE;
