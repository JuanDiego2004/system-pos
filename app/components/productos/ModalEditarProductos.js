import { useState, useEffect } from "react";

export default function ModalEditarProductos({ producto, onClose, onGuardar }) {
  const [datosProducto, setDatosProducto] = useState(producto);

  useEffect(() => {
    console.log("Producto recibido:", producto); 
    setDatosProducto(producto);
  }, [producto]);

  if (!producto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-11/12 md:w-[600px] rounded-lg shadow-xl p-6">
        <h2 className="text-xl font-bold mb-4">Detalles del Producto</h2>
        
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Producto:</h3>
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Nombre</th>
                <th className="border p-2">Cantidad</th>
                <th className="border p-2">Precio</th>
                <th className="border p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">{producto.nombre || 'N/A'}</td>
                <td className="border p-2 text-right">{producto.cantidad}</td>
                <td className="border p-2 text-right">S/ {(producto.precioVenta || 0).toFixed(2)}</td>
                <td className="border p-2 text-right">S/ {(producto.cantidad * (producto.precioVenta || 0)).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-between">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cerrar
          </button>
          <button 
            onClick={() => onGuardar(datosProducto)} 
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}