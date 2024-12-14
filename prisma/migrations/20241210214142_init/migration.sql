/*
  Warnings:

  - A unique constraint covering the columns `[ruc]` on the table `empresa` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ruc` to the `empresa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "empresa" ADD COLUMN     "ruc" VARCHAR(11) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "empresa_ruc_key" ON "empresa"("ruc");
