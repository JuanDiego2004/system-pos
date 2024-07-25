"use server";

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export default async function deleteProducto(formData) {
  const id = parseInt(formData.get("id"));

  try {
    await prisma.producto.delete({
      where: { id },
    });
    revalidatePath('/');
  } catch (e) {
    console.error(e);
  }
}
