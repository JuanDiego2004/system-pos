// components/ProductosServer.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function ProductosServer() {
  const productos = await prisma.producto.findMany();
  return productos;
}
