import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Manejo de solicitudes POST
export async function POST(req) {
  const { nombre, ruc, direccion, telefono, email } = await req.json();
  console.log("Datos recibidos:", { nombre, ruc, direccion, telefono, email }); // Log para depuración
  try {
    const nuevoProveedor = await prisma.proveedor.create({
      data: {
        nombre,
        ruc,
        direccion,
        telefono,
        email,
      },
    });
    console.log("Proveedor creado:", nuevoProveedor); // Log para depuración
    return new Response(JSON.stringify(nuevoProveedor), { status: 201 });
  } catch (error) {
    console.error("Error al crear proveedor:", error); // Log para depuración
    return new Response(JSON.stringify({ error: "Error al crear proveedor" }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}


export async function GET(req) {
  try {
    const proveedores =await prisma.proveedor.findMany(
    );
    return NextResponse.json(proveedores, {status: 200});
  } catch (error) {
    console.error("Error al obtener datos: ", error);
    return NextResponse.json({mensaje: "Error al obtener proveedores", error: error.mensaje}, {status: 500});

  } finally{
    await prisma.$disconnect();
  }
}


// Manejo de otros métodos no permitidos
export async function OPTIONS(req, res) {
  res.setHeader('Allow', ['POST', "GET"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
