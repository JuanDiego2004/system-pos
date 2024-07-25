"use server";


import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { supabase } from '@/supabase/supabaseClient';
const prisma = new PrismaClient();

export default async function addProducto(formData) {
  const nombre = formData.get("nombre");
  const precio = parseFloat(formData.get("precio"));
  const stock = parseInt(formData.get("stock"));
  const puntoVenta = formData.get("puntoVenta");
  const categoria = formData.get("categoria");



  if (categoria !== "PASTEL" && categoria !== "GASEOSA") {
    throw new Error("Categoría no válida");
  }

  try {
    const nuevoProducto = await prisma.producto.create({
      data: {
        nombre,
        precio,
        stock,
        puntoVenta,
        categoria, 
      //  imagen: imagenUrl, 
      },
    });
    revalidatePath("/");
    return nuevoProducto;
  } catch (e) {
    console.error(e);
    throw new Error("Error al agregar el producto");
  }
}
