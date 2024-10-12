import prisma from "@/lib/prisma";


// Inicia con valores por defecto si no existen
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

    const { cliente, productos, total, tipoVenta } = data;

    const ventaSerie = await prisma.serie.findFirst({
      where: { tipo: tipoVenta },
    });

    
    if (!ventaSerie) {
      return new Response(JSON.stringify({ error: `No se encontró la serie para el tipo de venta: ${tipoVenta}` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    

    // Validar que el cliente no esté vacío y tenga un id
    if (!cliente || !cliente.id) {
      console.error("Cliente no válido:", cliente);
      return new Response(JSON.stringify({ error: "Cliente no válido" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validar que productos no sea un arreglo vacío
    if (!Array.isArray(productos) || productos.length === 0) {
      console.error("Productos no válidos:", productos);
      return new Response(JSON.stringify({ error: "Productos no válidos" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validar cada producto y obtener precioCompra y categoría
    const productosConPrecioCompra = [];

    for (const producto of productos) {
      if (!producto.id || typeof producto.cantidad !== 'number' || typeof producto.precioVenta !== 'number') {
        console.error("Producto no válido:", producto);
        return new Response(JSON.stringify({ error: "Producto no válido" }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Obtener el precioCompra y categoría desde la base de datos
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

      // Verificar que hay suficiente stock
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
        categoria: productoDB.categoria, // Almacenar la categoría del producto
      });
    }

    // Calcular la utilidad
    let utilidadTotal = 0;
    productosConPrecioCompra.forEach(prod => {
      utilidadTotal += (prod.precioVenta - prod.precioCompra) * prod.cantidad;
    });
    console.log("Utilidad calculada:", utilidadTotal);


    

    // Ejecutar la transacción
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
          productos: {
            include: {
              producto: true,
            }
          }
        },
      });

      // Incrementar el contador de la serie
      await prisma.serie.update({
        where: { id: ventaSerie.id },
        data: { contador: { increment: 1 } },
      });

      // Actualizar el stock de los productos
      for (const prod of productos) {
        await prisma.producto.update({
          where: { id: prod.id },
          data: { stock: { decrement: prod.cantidad } },
        });
      }

      // Actualizar el stock de los productos
      for (const prod of productosConPrecioCompra) {
        await prisma.producto.update({
          where: { id: prod.productoId },
          data: { stock: { decrement: prod.cantidad } },
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




//cool kola 350, kr 350, kero 300, generade, agua lo 625, loa 1L, cielo 625, kris, 