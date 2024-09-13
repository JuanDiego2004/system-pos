"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import "../../globals.css";
import Edit from "../../assets/edit.png";
import Image from "next/image";
import Print from "../../assets/print.png";
import BarraEstadistico from "../BarraEstadistico";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const Skeleton = () => (
  <div className="p-4 bg-gray-200 rounded-lg animate-pulse">
    <div className="h-48 bg-gray-300 rounded-lg"></div>
    <div className="mt-4 h-6 bg-gray-300 rounded"></div>
    <div className="mt-2 h-4 bg-gray-300 rounded"></div>
    <div className="mt-2 h-4 bg-gray-300 rounded"></div>
  </div>
);

export default function Productos({
  productosIniciales,
  totalProductos,
  estadisticaInventario,
}) {
  const [productos, setProductos] = useState(productosIniciales);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoEditado, setProductoEditado] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false); // Estado para controlar el drawer

  const categorias = ["agua", "gaseosas", "frugos", "papas"];
   const [loading, setLoading] = useState(false);

  const handleCardClick = (producto) => {
    setProductoSeleccionado(producto);
    setProductoEditado({ ...producto });
    setModoEdicion(false);
    setDrawerVisible(true); // Mostrar el drawer
  };

  const handleCloseDrawer = () => {
    setDrawerVisible(false); // Ocultar el drawer
    setProductoSeleccionado(null);
  };

  const handleEditClick = () => {
    setModoEdicion(true);
    setProductoEditado({ ...productoSeleccionado });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductoEditado((prev) => ({ ...prev, [name]: value }));
  };

  const filteredProducts = productos.filter((producto) => {
    const matchesSearch = producto.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const matchesCategory = categoriaSeleccionada
      ? producto.categoria === categoriaSeleccionada
      : true;
    return matchesSearch && matchesCategory;
  });

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(
        `/api/productos/${productoSeleccionado.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...productoEditado,
            precioVenta: parseFloat(productoEditado.precioVenta),
            stock: parseInt(productoEditado.stock),
            peso: parseFloat(productoEditado.peso),
            precioCompra: parseFloat(productoEditado.precioCompra),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update product");
      }

      const updatedProduct = await response.json();
      setProductos((prevProductos) =>
        prevProductos.map((producto) =>
          producto.id === updatedProduct.id ? updatedProduct : producto
        )
      );
      setProductoSeleccionado(updatedProduct);
      setModoEdicion(false);
      handleCloseDrawer(); // Cerrar el drawer después de guardar
    } catch (error) {
      console.error("Error updating product:", error);
      // You might want to show an error message to the user here
    }
  };


  const handleSave = async () => {
    setLoading(true); // Activar el loader
    await handleSaveChanges(); // Llama a la función para guardar los cambios
    setLoading(false); // Desactivar el loader
  };

  const datosVentas = [
    { label: '0-10', frequency: 5 },
    { label: '11-20', frequency: 10 },
    { label: '21-30', frequency: 5 },
    { label: '31-40', frequency: 20 },
    { label: '11-20', frequency: 10 },
    { label: '0-10', frequency: 5 },
    { label: '11-20', frequency: 10 },
    { label: '21-30', frequency: 5 },
    { label: '31-40', frequency: 20 },
    { label: '11-20', frequency: 10 },
  ]

  const handlePrint = async () => {
    // Crea una nueva instancia de jsPDF
    const doc = new jsPDF();
    
    // Captura el gráfico usando html2canvas
    const chartElement = document.getElementById("chart"); // Asegúrate de que el gráfico tenga este ID
    const canvas = await html2canvas(chartElement);
    const imgData = canvas.toDataURL("image/png");
  
    // Añade la imagen del gráfico al PDF
    doc.addImage(imgData, "PNG", 10, 10, 180, 160); // Ajusta las coordenadas y el tamaño según necesites
    
    // Añade los datos del producto
    const productoData = `
      Nombre: ${productoSeleccionado.nombre}
      Precio Venta: ${productoSeleccionado.precioVenta}
      Precio Compra: ${productoSeleccionado.precioCompra}
      Stock: ${productoSeleccionado.stock}
      Categoría: ${productoSeleccionado.categoria}
    `;
    
    doc.text(productoData, 10, 180); // Ajusta las coordenadas según necesites
    
    // Guarda el PDF
    doc.save(`${productoSeleccionado.nombre}.pdf`);
  };


  

  return (
    <div className="flex relative">
      {/* Contenedor izquierdo */}
      <div className="w-full h-screen flex flex-col">
        {/* Header sticky */}
        <div className={`sticky top-0 z-20 p-4 border-b w-full }`}>
          <h1 className="text-2xl font-bold">Inventario</h1>
        </div>
        {/* estadisitca */}
        <div className="flex gap-5 justify-start items-end w-full h-32 p-4">
          <div className="h-full w-44 bg-gray-200 rounded-lg ">
            <h5 className="p-2 kanit-semibold text-4xl ">
              {estadisticaInventario.totalProductos}
            </h5>
            <p className="p-2 montserrat-uno text-xs">Total de Productos</p>
          </div>
          {/* card 2 */}
          <div className="h-full w-44 bg-gray-200 rounded-lg">
            <h5 className="p-2 kanit-semibold text-4xl ">
              ${estadisticaInventario.valorTotalProductos}
            </h5>
            <p className="p-2 montserrat-uno text-xs">
              Valor Total de Productos
            </p>
          </div>
        </div>
        {/* categorias */}
        <div className="w-full h-16 flex justify-end gap-5  p-4">
          <div className="w-8/12 h-full flex items-center space-x-4">
            {categorias.map((categoria) => (
              <div
                key={categoria}
                className={`cursor-pointer montserrat-uno flex items-center h-full p-2 rounded-sm ${
                  categoriaSeleccionada === categoria
                    ? "bg-gray-200 text-black "
                    : " text-black"
                }`}
                onClick={() =>
                  setCategoriaSeleccionada(
                    categoriaSeleccionada === categoria ? "" : categoria
                  )
                }
              >
                {categoria}
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-4/12 p-2 border rounded"
          />
        </div>
        {/* galeria de produictos */}
        <div className="flex-grow overflow-y-auto h-full">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead className="bg-gray-200 z-10" style={{ height: "40px" }}>
                <tr className="bg-gray-200 table-header text-gray-700">
                  <th className="py-2 px-4 border-b">Descripción</th>
                  <th className="py-2 px-4 border-b">Nombre</th>
                  <th className="py-2 px-4 border-b">Categoría</th>
                  <th className="py-2 px-4 border-b">Stock</th>
                  <th className="py-2 px-4 border-b">Precio V</th>
                  <th className="py-2 px-4 border-b">Precio C</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((producto) => (
                  <tr
                    key={producto.id}
                    className={`cursor-pointer transition-transform duration-300 transform hover:bg-gray-100 ${
                      productoSeleccionado?.id === producto.id
                        ? "bg-blue-100"
                        : ""
                    }`}
                    onClick={() => handleCardClick(producto)}
                  >
                    <td className="py-2 px-4 border-b">
                      <img
                        className="w-9 h-9 object-center"
                        src={producto.imagen}
                        alt={producto.nombre}
                      />
                    </td>
                    <td className="py-2 px-4 border-b text-gray-700">
                      {producto.nombre}
                    </td>
                    <td className="py-2 px-4 border-b text-gray-700">
                      {producto.categoria}
                    </td>
                    <td className="py-2 px-4 border-b text-gray-700">
                      {producto.stock}
                    </td>
                    <td className="py-2 px-4 border-b text-gray-700">
                      ${producto.precioVenta}
                    </td>
                    <td className="py-2 px-4 border-b text-gray-700">
                      ${producto.precioCompra}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Overlay para oscurecer el fondo */}
      {drawerVisible && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10"
          onClick={handleCloseDrawer} // Cerrar el drawer al hacer clic en el overlay
        ></div>
      )}

      {/* Contenedor derecho (Drawer) */}
      <div
        className={`fixed top-0 right-0 w-2/4 h-full bg-white p-4 mt-16 transition-transform duration-300 transform ${
          drawerVisible ? "translate-x-0" : "translate-x-full"
        } z-20`}
      >
        <button className="text-red-500" onClick={handleCloseDrawer}>
          Cerrar
        </button>
        {productoSeleccionado ? (
          <div className="p-4 ">
            {modoEdicion ? (
              <>
                <div className="flex flex-col md:flex-row md:space-x-8 p-4">
      <div className="w-full md:w-1/2">
        <h2 className="text-2xl font-semibold mb-4">Editar Producto</h2>
        
        <input
          type="text"
          name="nombre"
          value={productoEditado?.nombre || ""}
          onChange={handleInputChange}
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nombre del producto"
        />
        
        <input
          type="text"
          name="imagen"
          value={productoEditado?.imagen || ""}
          onChange={handleInputChange}
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="URL de la imagen"
        />
        
        <input
          type="number"
          name="precioVenta"
          value={productoEditado?.precioVenta || ""}
          onChange={handleInputChange}
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Precio de venta"
        />
        
        <input
          type="number"
          name="precioCompra"
          value={productoEditado?.precioCompra || ""}
          onChange={handleInputChange}
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Precio de compra"
        />
        
        <input
          type="number"
          name="stock"
          value={productoEditado?.stock || ""}
          onChange={handleInputChange}
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Stock"
        />
        
        <input
          type="number"
          name="peso"
          value={productoEditado?.peso || ""}
          onChange={handleInputChange}
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Peso (kg)"
        />
        
       
       
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center mt-4 md:mt-0">
        {productoEditado?.imagen && (
          <img
            src={productoEditado.imagen}
            alt={productoEditado.nombre || "Imagen del producto"}
            className="w-full h-auto rounded-lg shadow-md"
          />
        )}
      </div>
    </div>

    <button
          onClick={handleSave}
          className={`bg-black text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center">
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12c0-1.65.36-3.19.99-4.57L12 12h6.54c.68 1.73 2.21 3 4.46 3 0 0-3 0-3-4.99C20 8 24 5 24 5s-1.16 1.78-2.66 4.22C20.24 8.68 18.06 6 12 6c-6 0-12 6-12 12 0 6 6 12 12 12 6 0 12-6 12-12 0-2.89-1.05-5.51-2.82-7.63C20.43 10.45 20 11.2 20 12h-4.54l-1.93 1.93C14.21 14.64 12.71 16 11 16c-1 0-2-.84-2-2s.84-2 2-2c.47 0 .92.16 1.26.43L12 12l-8.8-8.8C2.29 3.21 0 5.44 0 8c0 4.25 3.75 8 8 8s8-3.75 8-8c0-.47-.07-.92-.19-1.35C13.43 5.69 12 3.74 12 1.62 12 1 11.56.21 11 0H6c-1.65 0-3 1.35-3 3s1.35 3 3 3h4c1.65 0 3-1.35 3-3s-1.35-3-3-3H6z" />
              </svg>
              Guardando...
            </div>
          ) : (
            'Guardar cambios'
          )}
        </button>
              </>
            ) : (
              <>
                <h3 className="text-2xl kanit-semibold">
                  {productoSeleccionado.nombre}
                </h3>
                <div className="flex justify-start gap-5 items-center w-full h-7 mt-4">
                  <div className="h-full w-20 bg-black rounded-md">
                    <div className="p-1 flex gap-2 justify-start items-center kanit-thin">
                      <Image className="" src={Edit} width={20} height={20} />
                      <p className="text-white text-sm">Editar</p>
                    </div>
                  </div>
                  <div onClick={handlePrint} className="h-full w-24 bg-black rounded-md">
                    <div className="p-1 flex gap-2 justify-start items-center">
                      <Image className="" src={Print} width={20} height={20} />
                      <p className="text-white text-sm kanit-thin">Imprimir</p>
                    </div>
                  </div>
                </div>

                {/* Informacion productos */}
                <h5 className="mt-4 kanit-semibold text-lg">
                  Información General
                </h5>
              <div className="flex justify-between items-center gap-3">
              <div className="space-y-2 w-9/12">
                  <div className="flex justify-between">
                    <span className="montserrat-dos text-gray-500 ">Precio Venta:</span>
                    <span className="text-gray-800 text-right">
                      ${productoSeleccionado.precioVenta}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 montserrat-dos">Precio Compra:</span>
                    <span className="text-gray-800 text-right">
                      ${productoSeleccionado.precioCompra}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 montserrat-dos">Stock:</span>
                    <span className="text-gray-800 text-right">
                      {productoSeleccionado.stock}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 montserrat-dos">Categoría:</span>
                    <span className="text-gray-800 text-right">
                      {productoSeleccionado.categoria}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 montserrat-dos">Valor Precio Venta:</span>
                    <span className="text-gray-800 text-right">
                      $
                      {productoSeleccionado.precioVenta *
                        productoSeleccionado.stock}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 montserrat-dos">Valor Precio Compra:</span>
                    <span className="text-gray-800 text-right">
                      $
                      {productoSeleccionado.precioCompra *
                        productoSeleccionado.stock}
                    </span>
                  </div>
                </div>
                <div className="w-4/12 h-36  rounded-md">
                  <img className="w-full h-full rounded-lg" src={productoSeleccionado.imagen} />
                </div>
              </div> 
              {/* Barra estadiustico */}
               <div id="chart" className="mt-24">
                 <BarraEstadistico  data={datosVentas} />
               </div>
                <button
                  onClick={handleEditClick}
                  className="bg-black text-white p-2 rounded"
                >
                  Editar
                </button>
              </>
            )}
          </div>
        ) : (
          <Skeleton />
        )}
      </div>
    </div>
  );
}
