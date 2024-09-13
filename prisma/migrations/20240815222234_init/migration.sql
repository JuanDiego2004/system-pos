/*
  Warnings:

  - The primary key for the `Producto` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `categoria` on the `Producto` table. All the data in the column will be lost.
  - You are about to drop the column `precio` on the `Producto` table. All the data in the column will be lost.
  - You are about to drop the column `puntoVenta` on the `Producto` table. All the data in the column will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `peso` to the `Producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precioCompra` to the `Producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precioVenta` to the `Producto` table without a default value. This is not possible if the table is not empty.
  - Made the column `imagen` on table `Producto` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "Producto" DROP CONSTRAINT "Producto_pkey",
DROP COLUMN "categoria",
DROP COLUMN "precio",
DROP COLUMN "puntoVenta",
ADD COLUMN     "peso" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "precioCompra" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "precioVenta" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "imagen" SET NOT NULL,
ADD CONSTRAINT "Producto_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Producto_id_seq";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "Categoria";
