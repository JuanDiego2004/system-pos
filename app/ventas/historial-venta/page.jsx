"use client";

import Header from "@/app/components/Header";
import { useState, useEffect } from "react";
import axios from "axios";
import StickyTable from "@/app/components/stickyHeader";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css

export default function Historial() {
  const [ventas, setVentas] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [startDate, setStartDate] = useState(null); // Inicializado como null
  const [endDate, setEndDate] = useState(null); // Inicializado como null
  const [mostrarCalendario, setMostrarCalendario] = useState(false);

  // Función para ajustar las fechas al inicio y fin del día
  const ajustarFechasInicioYFin = (startDate, endDate) => {
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0); // 00:00:00 en la zona horaria local

    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999); // 23:59:59 en la zona horaria local

    return { startOfDay, endOfDay };
  };

  // Función para traer ventas según el rango de fechas
  const TraerVentas = async (params = {}) => {
    setCargando(true);
    try {
      console.log("Parámetros enviados:", params);
      const { data } = await axios.get("/api/obtenerVentas", { params });
      setVentas(data);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setCargando(false);
    }
  };

  // Obtener ventas cuando se selecciona un rango de fechas
  useEffect(() => {
    if (startDate && endDate) {
      const { startOfDay, endOfDay } = ajustarFechasInicioYFin(startDate, endDate);
      TraerVentas({
        startDate: startOfDay.toISOString(),
        endDate: endOfDay.toISOString(),
      });
    }
  }, [startDate, endDate]);

  // Al cargar la página, obtener las ventas del día actual por defecto
  useEffect(() => {
    const today = new Date();
    const { startOfDay, endOfDay } = ajustarFechasInicioYFin(today, today);
    setStartDate(startOfDay);
    setEndDate(endOfDay);
  }, []); // Este efecto se ejecuta solo al montar el componente

  // Manejar la selección del rango de fechas
  const handleSelectRange = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const columns = ["Fecha", "Cliente", "Total", "Tipo de Venta"];

  const handleRowClick = (row) => {
    console.log("Fila seleccionada:", row);
  };

  const datosTabla = ventas.map((venta) => ({
    Fecha: venta.fecha,
    Cliente: venta.cliente.nombre,
    Total: venta.total.toFixed(2),
    "Tipo de Venta": venta.tipoVenta || "N/A",
  }));

  const handleToggleCalendario = () => {
    setMostrarCalendario(!mostrarCalendario);
  };

  return (
    <div>
      <Header title="Historial de ventas" />
      <div className="dropdown">
        <button className="dropdown-toggle" onClick={handleToggleCalendario}>
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
              data={datosTabla}
              onRowClick={handleRowClick}
            />
          ) : (
            <p>No hay resultados para la búsqueda.</p>
          )}
        </>
      )}
    </div>
  );
}
