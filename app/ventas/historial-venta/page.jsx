"use client";

import Header from "@/app/components/Header";
import { useState, useEffect } from "react";
import axios from "axios";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "react-date-range";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Image from "next/image";
import ModalEditarProductos from "@/app/components/productos/ModalEditarProductos";


function VentaItem({ venta, onVerDetalles}) {

  return ( 
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            {venta.cliente.nombre}
          </h3>
          <p className="text-sm text-gray-500">
            {new Date(venta.fecha).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-semibold text-green-600">
            S/ {venta.total.toFixed(2)}
          </p>
          <span className="text-xs text-gray-500">
            {venta.serie ? venta.serie.tipo : "Venta"}
          </span>
        </div>
      </div>

      <div className="border-t pt-2 mt-2">
        <button
          onClick={() => onVerDetalles(venta)}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Ver Detalles xd
        </button>
      </div>
    </div>
  );
}



export default function Historial() {
  const [ventas, setVentas] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);


  const TraerVentas = async (params = {}) => {
    setCargando(true);
    try {
      const { data } = await axios.get("/api/obtenerVentas", { params });
      setVentas(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const today = new Date();
    setStartDate(today);
    setEndDate(today);
    TraerVentas({
      startDate: today.toISOString(),
      endDate: today.toISOString(),
    });
  }, []);

  const handleSelectRange = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    setStartDate(startDate);
    setEndDate(endDate);
    TraerVentas({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
  };

  const handleToggleCalendario = () => {
    setMostrarCalendario(!mostrarCalendario);
  };


 function VentaModal({ venta, onClose , abrirEditarProducto}) {
    const [empresa, setEmpresa] = useState(null);
    const [productoParaEditar, setProductoParaEditar] = useState(null);
    const [mostrarModalParaEditar, setMostrarModalParaEditar] = useState(false);
    const [productos, setProductos] = useState([]);
  
    useEffect(() => {
      // Llamar a la API para obtener productos
      async function fetchProductos() {
        try {
          const response = await fetch("/api/productos");
          if (response.ok) {
            const data = await response.json();
            setProductos(data);
          } else {
            console.error("Error al cargar productos");
          }
        } catch (error) {
          console.error("Error en la solicitud:", error);
        }
      }
  
      fetchProductos();
    }, []);
  
    useEffect(() => {
      const obtenerDatosEmpresa = async () => {
        try {
          const { data } = await axios.get("/api/datoempresa");
          setEmpresa(data);
        } catch (error) {
          console.error("Error al obtener los datos de la empresa:", error);
        }
      };
      obtenerDatosEmpresa();
    }, []);
  
    if (!venta) return null;
  
    const imprimirVenta = () => {
      window.print();
    };
  
    const descargarPDF = () => {
      const doc = new jsPDF("p", "mm", "a4");
  
      // Encabezado con logo y detalles de la empresa
      if (empresa) {
        // Añadir logo si existe
        if (empresa.logo) {
          try {
            doc.addImage(empresa.logo, "PNG", 10, 10, 40, 40);
          } catch (error) {
            console.error("Error añadiendo el logo:", error);
          }
        }
  
        // Nombre de la empresa
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text(empresa.nombre, 105, 20, null, null, "center");
  
        // Dirección de la empresa
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(empresa.direccion, 105, 30, null, null, "center");
        doc.text(
          `RUC: ${empresa.ruc} | Teléfono: ${empresa.telefono}`,
          105,
          37,
          null,
          null,
          "center"
        );
  
        // Cuadro de boleta
        doc.setDrawColor(200);
        doc.setFillColor(230, 230, 230);
        doc.rect(150, 10, 50, 30, "FD");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text(venta.serie?.tipo || "N/A", 175, 17, null, null, "center");
        doc.text(`RUC: ${empresa.ruc}`, 175, 24, null, null, "center");
        doc.text(`${venta.serieNumero}`, 175, 31, null, null, "center");
      }
  
      // Detalles de la venta
      doc.autoTable({
        body: [
          [
            { content: "Fecha Emisión:", styles: { fontStyle: "bold" } },
            new Date(venta.fecha).toLocaleDateString(),
          ],
          [
            { content: "Señor(es):", styles: { fontStyle: "bold" } },
            venta.cliente.nombre,
          ],
          [
            { content: "Dirección:", styles: { fontStyle: "bold" } },
            venta.cliente.direccion,
          ],
          [{ content: "Tipo Moneda:", styles: { fontStyle: "bold" } }, "SOL"],
        ],
        theme: "grid",
        styles: {
          fontSize: 10,
          cellPadding: 3,
          font: "helvetica",
        },
        columnStyles: {
          0: { cellWidth: 40, fontStyle: "bold" },
          1: { cellWidth: "auto" },
        },
        startY: 50,
        margin: { left: 10, right: 10 },
      });
  
      // Tabla de productos
      doc.autoTable({
        head: [["Descripción", "Cantidad", "Precio"]],
        body: venta.productos.map((producto) => [
          producto.producto?.nombre || "N/A",
          producto.cantidad,
          `S/ ${(producto.precioVenta || 0).toFixed(2)}`,
        ]),
        theme: "grid",
        styles: {
          fontSize: 10,
          cellPadding: 3,
          font: "helvetica",
        },
        headStyles: {
          fillColor: [96, 96, 96],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        columnStyles: {
          0: { cellWidth: "auto" },
          1: { cellWidth: 30, halign: "center" },
          2: { cellWidth: 30, halign: "right" },
        },
        startY: doc.autoTable.previous.finalY + 10,
        margin: { left: 10, right: 10 },
      });
  
      // Total
      doc.autoTable({
        body: [
          [
            { content: "Importe Total", styles: { fontStyle: "bold" } },
            `S/ ${venta.total.toFixed(2)}`,
          ],
        ],
        theme: "grid",
        styles: {
          fontSize: 10,
          cellPadding: 3,
          font: "helvetica",
        },
        columnStyles: {
          0: { cellWidth: 40, fontStyle: "bold" },
          1: { cellWidth: "auto", halign: "right" },
        },
        startY: doc.autoTable.previous.finalY + 10,
        margin: { left: 10, right: 10 },
      });
  
      // Descargar PDF
      doc.save("venta_detalles.pdf");
    };
  
    const descargarXML = () => {
      generarXML(venta, empresa);
    };
  
  
    const abrirModalEditar = (producto) => {
      setProductoParaEditar(producto);
      setMostrarModalParaEditar(true);
    };
  
    const cerrarModalEditar = () => {
      setProductoParaEditar(null);
      setMostrarModalParaEditar(false);
    };
  
    const guardarCambiosProducto = async (productoEditado) => {
      try {
        await axios.put(`/api/productos/${productoEditado.id}`, productoEditado);
        // Actualiza la lista de ventas con el producto editado
        setVentas((ventas) =>
          ventas.map((venta) =>
            venta.id === productoEditado.id ? productoEditado : venta
          )
        );
        cerrarModalEditar();
      } catch (error) {
        console.error("Error al guardar cambios:", error);
      }
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white w-11/12 md:w-[600px] rounded-lg shadow-xl p-6">
          {/* Encabezado de la boleta */}
          <div className="border-b pb-4 mb-4">
            {empresa && (
              <>
                <div className="w-full h-auto flex justify-between items-center">
                  <div className="w-2/5 h-full flex items-center justify-between">
                    <Image
                      width={100}
                      height={100}
                      alt="logo empresa"
                      src={empresa.logo}
                    ></Image>
                    <h3 className="text-sm font-bold text-gray-500">
                      {empresa.nombre}
                    </h3>
                  </div>
                  <div className="w-60 p-1 h-20 rounded-sm bg-gray-300 items-center text-center">
                    <h4 className="text-md text-black font-bold">
                      {venta.serie?.tipo || "N/A"}
                    </h4>
                    <h4 className="text-sm text-black">
                      <strong className="font-bold">RUC: </strong>
                      {empresa.ruc}
                    </h4>
                    <h4 className="text-sm text-black">{venta.serieNumero}</h4>
                  </div>
                </div>
                {/*separador */}
                <div className="h-9"></div>
                <div className=" text-left">
                  <h3 className="text-sm font-bold text-black">
                    {empresa.nombre}
                  </h3>
                  <h3 className="text-sm text-gray-500">{empresa.direccion}</h3>
                </div>
              </>
            )}
          </div>
  
          <div className="w-full h-auto rounded-sm border-2 border-slate-400 flex justify-between items-center">
            <div className=" w-2/6 h-auto p-2">
              <h3 className="text-sm font-bold">Fecha Emision:</h3>
              <h3 className="text-sm font-bold">Señor(es):</h3>
              <h3 className="text-sm font-bold">Direccion:</h3>
              <h3 className="text-sm font-bold">Tipo Moneda:</h3>
            </div>
            <div className="w-3/4 h-auto ">
              <h3 className="font-sm">
                {new Date(venta.fecha).toLocaleDateString()}
              </h3>
              <h3 className="text-sm">{venta.cliente.nombre}</h3>
              <h3 className="text-sm">{venta.cliente.direccion}</h3>
              <h3 className="text-sm">SOL</h3>
            </div>
          </div>
  
          {/* Productos vendidos */}
          <div className="h-8"></div>
          <div className=" mb-4 overflow-x-auto max-h-64">
            <table className="w-full border-collapse  border-2 border-gray-400 ">
              <thead className="sticky top-0 bg-gray-100 border-2">
                <tr>
                  <th className="border-2 border-gray-400 p-2 text-center">
                    Descripcion
                  </th>
                  <th className="border-2 border-gray-400 p-2 text-center">
                    Cantidad
                  </th>
                  <th className="border-2 border-gray-400 p-2 text-center">
                    Precio
                  </th>
                  <th className="border-2 border-gray-400 p-2 text-center">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {venta.productos.map((producto, index) => (
                  <tr key={index}>
                    <td className="border-2 border-gray-400 p-2">
                      {producto.producto?.nombre || "N/A"}
                    </td>
                    <td className="border-2 border-gray-400 p-2 text-right">
                      {producto.cantidad}
                    </td>
                    <td className="border-2 border-gray-400 p-2 text-right">
                      {(producto.precioVenta || 0).toFixed(2)}
                    </td>
                    <td className="border-2 border-gray-400 p-2 text-right">
                      {producto.cantidad * producto.precioVenta}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
  
          <div className="flex justify-end">
            <div className="mb-4">
              <table className="border-collapse w-52 border-2 border-gray-400">
                <tr>
                  <td className="border-2 border-gray-400 p-1">
                    <h3 className="font-bold text-sm">Importe Total</h3>
                  </td>
                  <td className="border-2 border-gray-400 p-1">
                    S/ {venta.total.toFixed(2)}
                  </td>
                </tr>
              </table>
            </div>
          </div>
  
          {/* Botón de cierre */}
          <div className="text-center gap-4 flex justify-between">
            <button
              onClick={onClose}
              className="bg-blue-500 font-bold text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Cerrar
            </button>
            <button
              onClick={descargarPDF}
              className="bg-yellow-500 text-white font-bold px-6 py-2 rounded hover:bg-yellow-600 print:hidden"
            >
              Descargar PDF
            </button>
            <button
              onClick={() => descargarXML()}
              className=" bg-green-500 text-white font-bold py-2 px-6 rounded hover:bg-green-600 transition-colors"
            >
              Exportar XML
            </button>
            {productos.map((producto, index) => (
    <div key={index}>
      <button 
        onClick={() => abrirModalEditar(producto)}
        className="bg-orange-600 text-white font-bold rounded px-6 hover:bg-orange-500 transition-colors"
      >
        Editar
      </button>
    </div>
  ))}z
  
          </div>
  
          {mostrarModalParaEditar && (
    <ModalEditarProductos
      producto={productoParaEditar}
      onClose={cerrarModalEditar}
      onGuardar={guardarCambiosProducto}
    />
  )}
  
        
        </div>
      </div>
    );
  }

 


  return (
    <div className="bg-gray-100 min-h-screen">
      <Header title="Historial de Ventas" />

      <div className="container mx-auto px-4 py-6">
        <div className="mb-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleToggleCalendario}
          >
            Seleccionar Rango de Fechas
          </button>

          {mostrarCalendario && (
            <div className="mt-2">
              <DateRangePicker
                onChange={handleSelectRange}
                ranges={[
                  {
                    startDate: startDate,
                    endDate: endDate,
                    key: "selection",
                  },
                ]}
                moveRangeOnFirstSelection={false}
                editableDateInputs={true}
              />
            </div>
          )}
        </div>

        {cargando ? (
          <div className="text-center">Cargando ventas...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : ventas.length === 0 ? (
          <div className="text-center text-gray-500">
            No hay ventas en este periodo
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ventas.map((venta) => (
              <VentaItem
                key={venta.id}
                venta={venta}
                onVerDetalles={setVentaSeleccionada}
              />
            ))}
          </div>
        )}

        {ventaSeleccionada && (
          <VentaModal
            venta={ventaSeleccionada}
            onClose={() => setVentaSeleccionada(null)}
          />
        )}
      </div>
    </div>
  );
}
