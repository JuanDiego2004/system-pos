"use client";

import Header from "@/app/components/Header";
import { useEffect, useState } from "react";

export default function ComprasProveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [productosEncontrados, setProductosEncontrados] = useState([]);
  const [producto, setProducto] = useState({
    cantidad: 1,
    precioUnitario: 0,
  });
  const [totalCompra, setTotalCompra] = useState(0);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState("");

  // Obtener Proveedores
  useEffect(() => {
    const obtenerProveedores = async () => {
      try {
        const respuesta = await fetch("/api/proveedor");
        if (!respuesta.ok) {
          throw new Error("Error al obtener proveedores");
        }
        const datos = await respuesta.json();
        setProveedores(datos);
      } catch (error) {
        console.error("Error al traer proveedores:", error);
      }
    };
    obtenerProveedores();
  }, []);

  // Buscar productos
  const buscarProductos = async (query) => {
    try {
      const respuesta = await fetch(`/api/productos?search=${query}`);
      if (!respuesta.ok) {
        throw new Error("Error al buscar productos");
      }
      const datos = await respuesta.json();
      setProductosEncontrados(datos);
    } catch (error) {
      console.error("Error al buscar productos:", error);
    }
  };

  const agregarProducto = () => {
    if (!productoSeleccionado) return; // No agrega si no hay un producto seleccionado

    const nuevoProducto = {
      ...productoSeleccionado,
      cantidad: producto.cantidad,
      precioUnitario: producto.precioUnitario,
      total: producto.cantidad * producto.precioUnitario,
    };

    setProductos([...productos, nuevoProducto]);
    calcularTotal([...productos, nuevoProducto]);
    setProducto({ cantidad: 1, precioUnitario: 0 });
    setProductoSeleccionado(null); // Resetear selección
  };

  const calcularTotal = (productos) => {
    const total = productos.reduce((acc, item) => acc + item.total, 0);
    setTotalCompra(total);
  };

  async function registrarCompra(compraData) {
    try {
      const response = await axios.post('/api/compras', compraData);
      console.log('Compra registrada exitosamente:', response.data);
    } catch (error) {
      console.error('Error al registrar la compra:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Header title="Compras de Proveedores" />
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Realizar Compra</h2>

        {/* Selección de Proveedor */}
        <div className="mb-4">
          <label className="block text-gray-700">Seleccionar Proveedor</label>
          <select
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={proveedorSeleccionado}
            onChange={(e) => setProveedorSeleccionado(e.target.value)}
          >
            <option value="">Seleccione un proveedor</option>
            {proveedores.map((prov) => (
              <option key={prov.id} value={prov.id}>{prov.nombre}</option>
            ))}
          </select>
        </div>

        {/* Buscador de Productos */}
        <div className="mb-4">
          <label className="block text-gray-700">Buscar Producto</label>
          <input
            type="text"
            onChange={(e) => buscarProductos(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="Ingrese el nombre del producto"
          />
        </div>

        {/* Lista de Productos Encontrados */}
        {productosEncontrados.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Productos Encontrados</h3>
            <ul className="bg-gray-100 border border-gray-300 rounded mt-1 max-h-40 overflow-y-auto">
              {productosEncontrados.map((prod) => (
                <li
                  key={prod.id}
                  onClick={() => setProductoSeleccionado(prod)}
                  className="p-2 cursor-pointer hover:bg-blue-200"
                >
                  {prod.nombre} - S/. {prod.precio}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Detalles del Producto Seleccionado */}
        {productoSeleccionado && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Detalles del Producto Seleccionado</h3>
            <div>
              <p><strong>Nombre:</strong> {productoSeleccionado.nombre}</p>
              <p><strong>Precio Unitario:</strong> S/. {productoSeleccionado.precio}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700">Cantidad</label>
                <input
                  type="number"
                  value={producto.cantidad}
                  onChange={(e) => setProducto({ ...producto, cantidad: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-gray-700">Precio Unitario</label>
                <input
                  type="number"
                  value={producto.precioUnitario}
                  onChange={(e) => setProducto({ ...producto, precioUnitario: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  min="0"
                />
              </div>
            </div>
            <button
              onClick={agregarProducto}
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-200"
            >
              Agregar Producto
            </button>
          </div>
        )}

        {/* Lista de Productos Comprados */}
        <h3 className="text-lg font-semibold mt-6 mb-4">Productos Comprados</h3>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Nombre</th>
              <th className="py-2 px-4 border-b">Cantidad</th>
              <th className="py-2 px-4 border-b">Precio Unitario</th>
              <th className="py-2 px-4 border-b">Total</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((prod, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{prod.nombre}</td>
                <td className="py-2 px-4 border-b">{prod.cantidad}</td>
                <td className="py-2 px-4 border-b">S/. {prod.precioUnitario}</td>
                <td className="py-2 px-4 border-b">S/. {prod.total}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4">
          <h3 className="text-lg font-semibold">Total de la Compra: S/. {totalCompra.toFixed(2)}</h3>
        </div>
        <button className="mt-4 w-full py-2 px-4 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition duration-200">
          Confirmar Compra
        </button>
        <button className="mt-2 w-full py-2 px-4 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition duration-200">
          Cancelar
        </button>
      </div>
    </div>
  );
}
