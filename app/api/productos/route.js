import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Función para manejar las solicitudes POST
export async function POST(request) {
  const { nombre, descripcion, precio, categoria } = await request.json();
  // Validación de campos requeridos
  if (!nombre || !descripcion || !precio || !categoria) {
    return NextResponse.json({ message: "Todos los campos son requeridos" }, { status: 400 });
  }

  const producto = await prisma.producto.create({
    data: { nombre, descripcion, precio, categoria },
  });

  return NextResponse.json(producto, { status: 201 });
}

// Función para manejar las solicitudes GET
export async function GET(request) {
  const productos = await prisma.producto.findMany();
  return NextResponse.json(productos, { status: 200 });
}
