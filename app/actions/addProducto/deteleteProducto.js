"use server";


import { revalidatePath } from 'next/cache';
import prisma from "@/lib/prisma";


export default async function deleteProducto(id) {
  console.log("El id recibido es:", id); // Añadir esta línea para verificar el id

  if (typeof id !== 'number') {
    throw new Error(`El id proporcionado no es un número válido: ${id}`);
  }

  try {
    await prisma.producto.delete({
      where: {
        id: id,  // Asegúrate de que id es un número
      },
    });
    console.log("Producto eliminado con éxito");
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    throw error;
  }
}
