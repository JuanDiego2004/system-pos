// app/api/obtenerVentas/route.js

import prisma from '@/lib/prisma';
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    let where = {};

    if (startDateParam && endDateParam) {
      const fechaInicio = new Date(startDateParam);
      const fechaFin = new Date(endDateParam);

      // Validar fechas
      if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
        return NextResponse.json({ message: "Fechas inválidas" }, { status: 400 });
      }

      where = {
        fecha: {
          gte: fechaInicio,
          lte: fechaFin,
        },
      };
    }

    // Consulta a la base de datos con Prisma
    const ventas = await prisma.venta.findMany({
      where,
      include: {
        cliente: true,
        productos: {
          include: {
            producto: true, // Incluye los detalles del producto
          },
        },
        serie: {
          select: {
            tipo: true,
          },
        },
      },
      orderBy: {
        fecha: 'desc', // Opcional: ordenar por fecha descendente
      },
    });

    // Serializar las fechas para evitar problemas de serialización
    const ventasConFechas = ventas.map((venta) => ({
      ...venta,
      fecha: venta.fecha.toISOString().split('T')[0],
      clienteNombre: venta.cliente.nombre, // Acceder al nombre del cliente
      // Puedes agregar más campos si es necesario
    }));

    return NextResponse.json(ventasConFechas, { status: 200 });
  } catch (error) {
    console.error("Error al obtener ventas:", error);
    return NextResponse.json(
      { message: "Error interno del servidor", error: error.message },
      { status: 500 }
    );
  }
}



