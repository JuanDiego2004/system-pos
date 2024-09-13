"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from 'next/cache';
import { supabase } from '@/supabase/supabaseClient';
import fs from 'fs';
import path from 'path';




export default async function addProducto(formData) {
  const nombre = formData.get("nombre");
  const precio = parseFloat(formData.get("precio"));
  const stock = parseInt(formData.get("stock"));
  const puntoVenta = formData.get("puntoVenta");
  const categoria = formData.get("categoria");
  const imagenFile = formData.get("imagen");
  console.log(imagenFile);

  if (categoria !== "PASTEL" && categoria !== "GASEOSA") {
    throw new Error("Categoría no válida");
  }

  let imagenUrl = null;

  // Subir la imagen a Supabase
  if (imagenFile) {
    const { data, error } = await supabase
      .storage
      .from('productos')
      .upload(`imagenes/${Date.now()}_${imagenFile.name}`, imagenFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error("Error al subir la imagen:", error.message);
      throw new Error("Error al subir la imagen");
    }

    // Obtener la URL pública de la imagen subida
    const { data: publicUrlData, error: publicUrlError } = supabase
      .storage
      .from('productos')
      .getPublicUrl(data.path);

    if (publicUrlError) {
      console.error("Error al obtener la URL de la imagen:", publicUrlError.message);
      throw new Error("Error al obtener la URL de la imagen");
    }

    imagenUrl = publicUrlData.publicUrl;  // Correctamente asignamos la URL pública

    // Imprime la URL de la imagen
    console.log("URL de la imagen subida:", imagenUrl);
  }

  try {
    const nuevoProducto = await prisma.producto.create({
      data: {
        nombre,
        precio,
        stock,
        puntoVenta,
        categoria, 
        imagen: imagenUrl, 
      },
    });
    revalidatePath("/");
    return nuevoProducto;
  } catch (e) {
    console.error(e);
    throw new Error("Error al agregar el producto");
  }


  
}


