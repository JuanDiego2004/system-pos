/*
  Warnings:

  - Added the required column `serieNumero` to the `Venta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Venta" ADD COLUMN     "serieNumero" TEXT NOT NULL;
