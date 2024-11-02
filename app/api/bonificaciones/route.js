import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const bonificaciones = await prisma.bonificacion.findMany({
      include: {
        producto: true,
      },
    });
    return NextResponse.json(bonificaciones, { status: 200 });
  } catch (error) {
    console.error("Error al obtener las bonificaciones:", error);
    return NextResponse.json({ message: "Error al obtener las bonificaciones" }, { status: 500 });
  }
}
