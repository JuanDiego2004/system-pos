import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Función para manejar las solicitudes GET, PATCH y DELETE
export async function handler(request) {
  const { method } = request;
  const id = request.nextUrl.pathname.split('/').pop(); // Obtener ID de la URL

  switch (method) {
    case "GET":
      return await obtenerProducto(id);
    case "PATCH":
      return await editarProducto(request, id);
    case "DELETE":
      return await eliminarProducto(id);
    default:
      return NextResponse.json({ message: "Método no permitido" }, { status: 405 });
  }
}

// Obtener un producto por ID
async function obtenerProducto(id) {
  const producto = await prisma.producto.findUnique({ where: { id } });
  return producto 
    ? NextResponse.json(producto, { status: 200 }) 
    : NextResponse.json({ message: "Producto no encontrado" }, { status: 404 });
}

// Editar un producto
async function editarProducto(request, id) {
  try {
    const body = await request.json();
    const data = {};

    // Verificar cada campo en el body
    for (const key in body) {
      if (body[key] !== undefined && body[key] !== null && body[key] !== "") {
        data[key] = body[key];
      }
    }

    // Asegurarse de que haya datos para actualizar
    if (Object.keys(data).length === 0) {
      return NextResponse.json({ message: 'No se proporcionaron datos para actualizar.' }, { status: 400 });
    }

    const producto = await prisma.producto.update({
      where: { id },
      data,
    });

    return NextResponse.json(producto, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error al editar producto', error: error.message }, { status: 500 });
  }
}

// Eliminar un producto
async function eliminarProducto(id) {
  await prisma.producto.delete({ where: { id } });
  return NextResponse.json({ message: "Producto eliminado" }, { status: 204 });
}

// Exporta los métodos para las diferentes solicitudes
export async function GET(request) {
  const id = request.nextUrl.pathname.split('/').pop(); // Obtener ID de la URL
  return await obtenerProducto(id);
}

export async function PATCH(request) {
  const id = request.nextUrl.pathname.split('/').pop(); // Obtener ID de la URL
  return await editarProducto(request, id);
}

export async function DELETE(request) {
  const id = request.nextUrl.pathname.split('/').pop(); // Obtener ID de la URL
  return await eliminarProducto(id);
}
