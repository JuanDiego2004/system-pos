-- CreateTable
CREATE TABLE "Bonificacion" (
    "id" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bonificacion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bonificacion" ADD CONSTRAINT "Bonificacion_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
