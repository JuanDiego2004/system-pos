"use client";

import Header from "@/app/components/Header";
import { useState, useEffect } from "react";
import axios from "axios";
import StickyTable from "@/app/components/stickyHeader";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css

// Componente Modal para mostrar los detalles de la venta
function VentaModal({ venta, onClose }) {
  if (!venta) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Detalles de la Venta</h2>
        <p><strong>Cliente:</strong> {venta.cliente.nombre}</p>
        <p><strong>Fecha:</strong> {new Date(venta.fecha).toLocaleDateString()}</p>
        <p><strong>Total:</strong> {venta.total.toFixed(2)}</p>
        <p><strong>Tipo de Venta:</strong> {venta.serie ? venta.serie.tipo : "N/A"}</p>
        <p><strong>Productos:</strong></p>
        <ul>
          {venta.productos.map((producto, index) => (
            <li key={index}>
              {producto.producto.nombre} - Cantidad: {producto.cantidad} - Precio: {producto.precioVenta.toFixed(2)}
            </li>
          ))}
        </ul>
        <button onClick={onClose} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default function Historial() {
  const [ventas, setVentas] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

  const ajustarFechasInicioYFin = (startDate, endDate) => {
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);
    return { startOfDay, endOfDay };
  };

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
    if (startDate && endDate) {
      const { startOfDay, endOfDay } = ajustarFechasInicioYFin(startDate, endDate);
      TraerVentas({
        startDate: startOfDay.toISOString(),
        endDate: endOfDay.toISOString(),
      });
    }
  }, [startDate, endDate]);

  useEffect(() => {
    const today = new Date();
    const { startOfDay, endOfDay } = ajustarFechasInicioYFin(today, today);
    setStartDate(startOfDay);
    setEndDate(endOfDay);
  }, []);

  const handleSelectRange = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const columns = ["ID" ,"Fecha", "Cliente", "Total", "Tipo de Venta"];
  
  const handleRowClick = (row) => {
    const venta = ventas.find((venta) => venta.id === row.id);
    setVentaSeleccionada(venta);
  };

  const handleToggleCalendario = () => {
    setMostrarCalendario(!mostrarCalendario);
  };

  const handleCloseModal = () => {
    setVentaSeleccionada(null);
  };

  return (
    <div>
      <Header title="Historial de ventas" />
      <div className="dropdown p-4">
        <button className="dropdown-toggle bg-blue-600 text-white font-bold p-2 rounded-lg" onClick={handleToggleCalendario}>
          Seleccionar rango de fechas
        </button>
        <div
          className={`dropdown-content p-4 bg-gray-200 rounded-lg ${
            mostrarCalendario ? "h-full opacity-100 visible" : "h-7 opacity-0 invisible"
          }`}
          style={{ transition: "opacity 700ms" }}
        >
          <DateRangePicker
            onChange={handleSelectRange}
            ranges={[{ startDate: startDate, endDate: endDate, key: "selection" }]}
            moveRangeOnFirstSelection={false}
            editableDateInputs={true}
          />
        </div>
      </div>
      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {ventas.length > 0 ? (
            <StickyTable
              columns={columns}
              data={ventas.map((venta) => ({
                id: String(venta.id),
                Fecha: new Date(venta.fecha).toLocaleDateString(),
                Cliente: venta.cliente.nombre,
                Total: venta.total.toFixed(2),
                "Tipo de Venta": venta.serie ? venta.serie.tipo : "N/A",
                
              }))}
              onRowClick={handleRowClick}
            />
          ) : (
            <p>No hay resultados para la búsqueda.</p>
          )}
        </>
      )}
      {ventaSeleccionada && (
        <VentaModal venta={ventaSeleccionada} onClose={handleCloseModal} />
      )}
    </div>
  );
}
