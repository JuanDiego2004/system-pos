/*
  Warnings:

  - Made the column `total` on table `Venta` required. This step will fail if there are existing NULL values in that column.
  - Made the column `utilidad` on table `Venta` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Venta" ADD COLUMN     "usuarioId" TEXT,
ALTER COLUMN "total" SET NOT NULL,
ALTER COLUMN "utilidad" SET NOT NULL;

-- AlterTable
ALTER TABLE "VentaProducto" ADD COLUMN     "categoria" "Categoria" NOT NULL DEFAULT 'Otros',
ALTER COLUMN "precioCompra" SET DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
