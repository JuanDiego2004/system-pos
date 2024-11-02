import prisma from "@/lib/prisma";

const inicializarSeries = async () => {
  const seriesFactura = await prisma.serie.findFirst({ where: { tipo: "Factura" } });
  const seriesBoleta = await prisma.serie.findFirst({ where: { tipo: "Boleta" } });
  if (!seriesFactura) {
    await prisma.serie.create({
      data: { tipo: "Factura", serie: "F001", contador: 1 }
    });
  }
  if (!seriesBoleta) {
    await prisma.serie.create({
      data: { tipo: "Boleta", serie: "B001", contador: 1 }
    });
  }
};

await inicializarSeries();

export async function POST(req) {
  try {
    const data = await req.json();
    console.log("Datos recibidos en /api/ventas:", data);
    const { cliente, productos, total, tipoVenta, bonificaciones } = data;
    const ventaSerie = await prisma.serie.findFirst({
      where: { tipo: tipoVenta },
    });

    if (!ventaSerie) {
      return new Response(JSON.stringify({ error: `No se encontró la serie para el tipo de venta: ${tipoVenta}` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!cliente || !cliente.id) {
      console.error("Cliente no válido:", cliente);
      return new Response(JSON.stringify({ error: "Cliente no válido" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!Array.isArray(productos) || productos.length === 0) {
      console.error("Productos no válidos:", productos);
      return new Response(JSON.stringify({ error: "Productos no válidos" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const productosConPrecioCompra = [];
    for (const producto of productos) {
      if (!producto.id || typeof producto.cantidad !== 'number' || typeof producto.precioVenta !== 'number') {
        console.error("Producto no válido:", producto);
        return new Response(JSON.stringify({ error: "Producto no válido" }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      const productoDB = await prisma.producto.findUnique({
        where: { id: producto.id },
        select: { precioCompra: true, stock: true, categoria: true },
      });
      if (!productoDB) {
        console.error("Producto no encontrado en la base de datos:", producto.id);
        return new Response(JSON.stringify({ error: `Producto no encontrado: ${producto.id}` }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      if (productoDB.stock < producto.cantidad) {
        console.error(`Stock insuficiente para el producto ID: ${producto.id}`);
        return new Response(JSON.stringify({ error: `Stock insuficiente para el producto: ${producto.id}` }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      productosConPrecioCompra.push({
        productoId: producto.id,
        cantidad: producto.cantidad,
        precioVenta: producto.precioVenta,
        precioCompra: productoDB.precioCompra,
        categoria: productoDB.categoria,
      });
    }

    for (const bonificacion of bonificaciones) {
      productosConPrecioCompra.push({
        productoId: bonificacion.productoId,
        cantidad: bonificacion.cantidad,
        precioVenta: 0,
        precioCompra: 0,
        categoria: "Bonificación",
      });
    }

    let utilidadTotal = 0;
    productosConPrecioCompra.forEach(prod => {
      utilidadTotal += (prod.precioVenta - prod.precioCompra) * prod.cantidad;
    });
    console.log("Utilidad calculada:", utilidadTotal);

    const venta = await prisma.$transaction(async (prisma) => {
      const serieActual = `${ventaSerie.serie}-${ventaSerie.contador.toString().padStart(6, '0')}`;

      const nuevaVenta = await prisma.venta.create({
        data: {
          clienteId: cliente.id,
          total: total,
          serieId: ventaSerie.id,
          utilidad: utilidadTotal,
          productos: {
            create: productosConPrecioCompra.map((producto) => ({
              productoId: producto.productoId,
              cantidad: producto.cantidad,
              precioVenta: producto.precioVenta,
              precioCompra: producto.precioCompra,
            })),
          },
          serieNumero: serieActual,
        },
        include: {
          productos: { include: { producto: true } },
        },
      });

      await prisma.serie.update({
        where: { id: ventaSerie.id },
        data: { contador: { increment: 1 } },
      });

      for (const prod of productos) {
        await prisma.producto.update({
          where: { id: prod.id },
          data: { stock: { decrement: prod.cantidad } },
        });
      }
      for (const bonif of bonificaciones) {
        await prisma.producto.update({
          where: { id: bonif.productoId },
          data: { stock: { decrement: bonif.cantidad } },
        });
      }

      return nuevaVenta;
    });

    console.log("Venta creada exitosamente:", venta);
    return new Response(JSON.stringify(venta), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error al crear la venta en /api/ventas:", error);
    return new Response(JSON.stringify({ error: "Error al crear la venta" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
