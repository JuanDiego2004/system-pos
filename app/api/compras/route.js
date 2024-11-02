import { Prisma } from "@prisma/client";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { proveedorId, productos, usuarioId } = req.body;

    try {
      // Calcular el total de la compra
      const total = productos.reduce(
        (acc, producto) => acc + producto.precioCompra * producto.cantidad,
        0
      );

      // Crear la compra en la tabla Compra
      const compra = await prisma.compra.create({
        data: {
          proveedorId,
          usuarioId,
          total,
          productos: {
            create: productos.map((prod) => ({
              productoId: prod.id,
              cantidad: prod.cantidad,
              precioCompra: prod.precioCompra,
            })),
          },
        },
      });

      // Actualizar el stock de cada producto comprado
      for (const prod of productos) {
        await prisma.producto.update({
          where: { id: prod.id },
          data: {
            stock: {
              increment: prod.cantidad,
            },
          },
        });
      }

      return res.status(201).json({ message: 'Compra registrada exitosamente', compra });
    } catch (error) {
      console.error('Error al registrar la compra:', error);
      return res.status(500).json({ message: 'Error al registrar la compra', error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
