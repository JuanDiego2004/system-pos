import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Función para manejar las solicitudes POST
export async function POST(request) {
  const { email, password } = await request.json();
  // Validación de campos requeridos
  if (!email || !password) {
    return NextResponse.json({ message: "Todos los campos son requeridos" }, { status: 400 });
  }

  const usuario = await prisma.usuario.create({
    data: { email, password },
  });

  return NextResponse.json(usuario, { status: 201 });
}

// Función para manejar las solicitudes GET
export async function GET(request) {
  const usuarios = await prisma.usuario.findMany();
  return NextResponse.json(usuarios, { status: 200 });
}