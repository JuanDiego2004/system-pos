-- AlterTable
ALTER TABLE "Producto" ALTER COLUMN "categoria" SET DEFAULT 'Otros';

-- CreateTable
CREATE TABLE "Userio" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Userio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Userio_email_key" ON "Userio"("email");
