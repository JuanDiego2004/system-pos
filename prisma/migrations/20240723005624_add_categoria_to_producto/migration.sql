/*
  Warnings:

  - Added the required column `categoria` to the `Producto` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Categoria" AS ENUM ('PASTEL', 'GASEOSA');

-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "categoria" "Categoria" NOT NULL;
