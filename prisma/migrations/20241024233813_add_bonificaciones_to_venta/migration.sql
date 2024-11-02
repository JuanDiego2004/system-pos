/*
  Warnings:

  - You are about to drop the `_BonificacionToVenta` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BonificacionToVenta" DROP CONSTRAINT "_BonificacionToVenta_A_fkey";

-- DropForeignKey
ALTER TABLE "_BonificacionToVenta" DROP CONSTRAINT "_BonificacionToVenta_B_fkey";

-- AlterTable
ALTER TABLE "Bonificacion" ADD COLUMN     "ventaId" TEXT;

-- DropTable
DROP TABLE "_BonificacionToVenta";

-- AddForeignKey
ALTER TABLE "Bonificacion" ADD CONSTRAINT "Bonificacion_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "Venta"("id") ON DELETE SET NULL ON UPDATE CASCADE;
