-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "tipoDocumento" TEXT NOT NULL,
    "codigoCliente" TEXT NOT NULL,
    "lugar" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "numeroDocumento" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_codigoCliente_key" ON "Cliente"("codigoCliente");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_numeroDocumento_key" ON "Cliente"("numeroDocumento");
