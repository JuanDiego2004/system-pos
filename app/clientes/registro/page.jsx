// app/clientes/registro/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StickyTable from "@/app/components/stickyHeader";

export default function Registro() {
  // Estado inicial del cliente
  const [cliente, setCliente] = useState({
    tipoDocumento: "",
    codigoCliente: "",
    lugar: "",
    direccion: "",
    numeroDocumento: "",
    nombre: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  // Maneja los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente((prev) => ({ ...prev, [name]: value }));
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita el comportamiento por defecto del formulario
    setError(""); // Reinicia el estado de error

    console.log("Cliente antes de validar:", cliente); // Log para ver el estado de cliente

    // Verificar si todos los campos son válidos
    if (
      !cliente.tipoDocumento ||
      !cliente.codigoCliente ||
      !cliente.lugar ||
      !cliente.direccion ||
      !cliente.numeroDocumento ||
      !cliente.nombre
    ) {
      setError("Todos los campos son requeridos");
      return;
    }

    try {
      const res = await fetch("/api/clientes", {
        method: "POST", // Usamos el método POST para registrar el cliente
        headers: { "Content-Type": "application/json" }, // Establece el tipo de contenido
        body: JSON.stringify(cliente), // Convierte los datos del cliente a JSON
      });

      if (!res.ok) {
        const errorData = await res.json(); // Maneja el error en caso de respuesta no exitosa
        throw new Error(errorData.message || "Error al registrar el cliente");
      }

      const data = await res.json(); // Obtiene la respuesta JSON del servidor
      console.log("Cliente registrado:", data);

      // Redirigir o mostrar mensaje de éxito
      router.push("/clientes/registro"); // Cambia la ruta según tu estructura de aplicación
    } catch (error) {
      console.error("Error:", error);
      setError(error.message); // Establece el mensaje de error en el estado
    }
  };

  //lista de clientes
  const [listaClientes, setListaClientes] = useState([]);
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState("");

  useEffect(() => {
    const TraerClientes = async () => {
      try {
        const respuesta = await fetch("/api/clientes");
        if (!respuesta.ok) {
          const errorData = await respuesta.json();
          throw new Error(errorData.mensaje || "Error al obtener clientes");
        }
        const datos = await respuesta.json();
        listaClientes(datos);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
      }
    };
    TraerClientes();
  }, []);

  //par a filtrar medinate busqeuda
  const [busqueda, setBusqueda] = useState("");
  const handleBusqueda = (e) => {
    setBusqueda(e.target.value);
  };
  //funcion para manejar el cambio del dropdown
  const handleCiudadSeleccionada = (e) => {
    setCiudadSeleccionada(e.target.value);
  };

  //funcion solo para filtrar mediante input
  // const clientesFiltrados = listaClientes.filter((cliente) =>
  // cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) || cliente.numeroDocumento.includes(busqueda));
  const columns = ["Nombre", "Documentos", "Tipo De Documento"];

  //funcion para fitro input y dropdown y Filtrar clientes según la búsqueda y la ciudad seleccionada
  const clientesFiltrados = listaClientes.filter(
    (cliente) =>
      (cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        cliente.numeroDocumento.includes(busqueda)) &&
      (ciudadSeleccionada === "" || cliente.lugar === ciudadSeleccionada)
  );
  //obtener las ciudaded disponibles
  const ciudades = [...new Set(listaClientes.map((cliente) => cliente.lugar))];

  // Crear un nuevo array con solo los campos que deseas mostrar
  const datos = clientesFiltrados.map((cliente) => ({
    nombre: cliente.nombre,
    numeroDocumento: cliente.numeroDocumento,
    tipoDocumento: cliente.tipoDocumento,
  }));

  //-----------------------------------------------------------------------------------------
  // -----------  FUNCIONES PARTA MODAL DE REGISTRO DE CLIENTES -----------------------------
  //-----------------------------------------------------------------------------------------
  const [modalEstaAbierto, setModalEstaAbierto] = useState(false);

  const abrirModal = () => {
    setModalEstaAbierto(true);
  };

  const cerrarModal = () => {
    setModalEstaAbierto(false);
    setCliente({
      tipoDocumento: "",
      codigoCliente: "",
      lugar: "",
      direccion: "",
      numeroDocumento: "",
      nombre: "",
    });
    setError("");
  };

  const handleRowClick = (row) => {
    setCliente({
      tipoDocumento: row.tipoDocumento,
      codigoCliente: row.codigoCliente,
      lugar: row.lugar,
      direccion: row.direccion,
      numeroDocumento: row.numeroDocumento,
      nombre: row.nombre,
    });
    setModalEstaAbierto(true);
  };
  return (
    <div className="container bg-grayCustom mx-auto p-4 h-screen rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Registro de Cliente</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="w-full flex justify-between gap-4 ">
        <div className="w-1/2"></div>
        <div className="w-2/5 flex justify-between gap-2">
          <input
            type="text"
            placeholder="Buscar cliente"
            value={busqueda}
            onChange={handleBusqueda}
            className="w-36 border p-2 mb-4"
          />
          <select
            value={ciudadSeleccionada}
            onChange={handleCiudadSeleccionada}
            className="w-24 border p-2  mb-4"
          >
            <option value="">Filtro</option>
            {ciudades.map((ciudad, index) => (
              <option key={index} value={ciudad}>
                {ciudad}
              </option>
            ))}
          </select>
          <button
            onClick={abrirModal}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Regi
          </button>
        </div>
      </div>

      {/* MODAL */}
      {modalEstaAbierto && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-1/3 relative">
            <button
              onClick={cerrarModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
            <h2 className="text-xl font-bold mb-4">Registrar Cliente</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="tipoDocumento" className="block mb-1">
                  Tipo de Documento:
                </label>
                <select
                  id="tipoDocumento"
                  name="tipoDocumento"
                  value={cliente.tipoDocumento}
                  onChange={handleChange}
                  required
                  className="w-full border p-2"
                >
                  <option value="DNI">DNI</option>
                  <option value="RUC">RUC</option>
                </select>
              </div>
              <div>
                <label htmlFor="numeroDocumento" className="block mb-1">
                  Número de Documento:
                </label>
                <input
                  type="text"
                  id="numeroDocumento"
                  name="numeroDocumento"
                  value={cliente.numeroDocumento}
                  onChange={handleChange}
                  required
                  className="w-full border p-2"
                />
              </div>
              <div>
                <label htmlFor="codigoCliente" className="block mb-1">
                  Código de Cliente:
                </label>
                <input
                  type="text"
                  id="codigoCliente"
                  name="codigoCliente"
                  value={cliente.codigoCliente}
                  onChange={handleChange}
                  required
                  className="w-full border p-2"
                />
              </div>
              <div>
                <label htmlFor="lugar" className="block mb-1">
                  Lugar:
                </label>
                <select
                  id="lugar"
                  name="lugar"
                  value={cliente.lugar}
                  onChange={handleChange}
                  required
                  className="w-full border p-2"
                >
                  <option value="OROYA">OROYA</option>
                  <option value="HUANCAYO">HUANCAYO</option>
                  <option value="CHUPACA">CHUPACA</option>
                  <option value="TARMA">TARMA</option>
                  <option value="SAN CARLOS">SAN CARLOS</option>
                </select>
              </div>
              <div>
                <label htmlFor="direccion" className="block mb-1">
                  Dirección:
                </label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={cliente.direccion}
                  onChange={handleChange}
                  required
                  className="w-full border p-2"
                />
              </div>

              <div>
                <label htmlFor="nombre" className="block mb-1">
                  Nombre:
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={cliente.nombre}
                  onChange={handleChange}
                  required
                  className="w-full border p-2"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded"
              >
                Registrar Cliente
              </button>
            </form>
          </div>
        </div>
      )}

      {datos.length > 0 ? (
        <StickyTable columns={columns} data={datos} onRowClick={handleRowClick} />
      ) : (
        <p>No hay resultados para la búsqueda.</p>
      )}
    </div>
  );
}
