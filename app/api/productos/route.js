import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Función para manejar las solicitudes POST
export async function POST(request) {
  const { nombre, descripcion, precio, categoria, productoId } = await request.json();

  // Validación de campos requeridos para producto
  if (nombre && descripcion && precio && categoria) {
    const producto = await prisma.producto.create({
      data: { nombre, descripcion, precio, categoria },
    });

    return NextResponse.json(producto, { status: 201 });
  }

  // Validación de campos requeridos para bonificación
  if (productoId) {
    const bonificacion = await prisma.bonificacion.create({
      data: { productoId },
    });

    return NextResponse.json(bonificacion, { status: 201 });
  }

  return NextResponse.json({ message: "Todos los campos son requeridos" }, { status: 400 });
}

// Función para manejar las solicitudes GET
export async function GET(request) {
  const url = new URL(request.url);
  const endpoint = url.pathname.split("/").pop();

  if (endpoint === "productos") {
    const productos = await prisma.producto.findMany();
    return NextResponse.json(productos, { status: 200 });
  }

  if (endpoint === "bonificaciones") {
    const bonificaciones = await prisma.bonificacion.findMany({
      include: { producto: true },
    });
    return NextResponse.json(bonificaciones, { status: 200 });
  }

  return NextResponse.json({ message: "Endpoint no encontrado" }, { status: 404 });
}


// Función para manejar las solicitudes DELETE
export async function DELETE(request) {
  try {
    const { productoId } = await request.json();

    if (!productoId) {
      return NextResponse.json({ message: "Producto ID es requerido" }, { status: 400 });
    }

    await prisma.bonificacion.deleteMany({
      where: { productoId },
    });

    return NextResponse.json({ message: "Bonificación eliminada" }, { status: 200 });
  } catch (error) {
    console.error("Error al eliminar bonificación:", error);
    return NextResponse.json({ message: "Error al eliminar bonificación" }, { status: 500 });
  }
}
