

import Header from "../components/Header";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export default async function Inventario() {
  const productos = await prisma.producto.findMany();

  return (
    <main className="container mx-auto px-4">
      <Header title="Inventario" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
       {productos.map((producto) => (
        <div key={producto.id} className="bg-white shadow-md rounded-lg overflow-hidden">
          {producto.imagen && (
            <img src={producto.imagen} alt={producto.nombre} className="w-full h-47 object-cover" />
          )}
  <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900">{producto.nombre}</h2>
              <p className="text-gray-700">Precio: {producto.precio}</p>
              <p className="text-gray-700">Stock: {producto.stock}</p>
              <p className="text-gray-700">Punto de Venta: {producto.puntoVenta}</p>
            </div>
        </div>
       ))}
      </div>
    </main>
  );
}