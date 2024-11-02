"use client";
import Header from "@/app/components/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import StickyTable from "@/app/components/stickyHeader";

// Función para validar los datos del proveedor
const validarProveedorData = (data) => {

  const errores = {};

  // Validar que el nombre no esté vacío
  if (!data.nombre.trim()) {
    errores.nombre = "El nombre es obligatorio";
  }

  // Validar RUC: debe tener 11 dígitos y solo contener números
  if (!/^\d{11}$/.test(data.ruc)) {
    errores.ruc = "El RUC debe tener 11 dígitos y solo contener números";
  }

  // Validar teléfono: debe tener 9 dígitos y solo contener números
  if (!/^\d{9}$/.test(data.telefono)) {
    errores.telefono = "El teléfono debe tener 9 dígitos";
  }

  // Validar email: debe ser un formato de correo electrónico válido
  if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email)) {
    errores.email = "El formato de correo electrónico no es válido";
  }

  return errores;
};

const registrarProveedor = async (proveedorData) => {


  try {
    const response = await axios.post("/api/proveedor", proveedorData);
    return response.data;
  } catch (error) {
    console.error("Error al registrar proveedor:", error); // Log para depuración
    throw error;
  }
};

export default function Registro() {
  

  const [formData, setFormData] = useState({
    nombre: "",
    ruc: "",
    direccion: "",
    telefono: "",
    email: ""
  });
  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar los datos antes de enviarlos
    const erroresValidacion = validarProveedorData(formData);
    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion);
      setMensaje("Corrige los errores antes de enviar el formulario");
      return;
    }

    try {
      const nuevoProveedor = await registrarProveedor(formData);
      setMensaje("Proveedor registrado correctamente");
      setErrores({});
      setFormData({
        nombre: "",
        ruc: "",
        direccion: "",
        telefono: "",
        email: ""
      });
    } catch (error) {
      setMensaje("Error al registrar proveedor");
    }
  };

  const [listaProveedor, setListaProveedor] = useState([]);
  const [error, setError] = useState("");

  const traerProveedores = async () => {
    try {
      const respuesta = await fetch("/api/proveedor");
      console.log("Respuesta:", respuesta); // Verifica el estado de la respuesta
      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.error || "Error al obtener proveedores");
      }
      const datos = await respuesta.json();
      console.log("Datos recibidos:", datos); // Log para confirmar el contenido
      setListaProveedor(datos);
    } catch (error) {
      console.error("Error al traer proveedores:", error);
      setError(error.message);
    }
  };
  

  useEffect(() => {
    traerProveedores();
  }, []);
  


  const columnas =["Nombre", "RUC", "Telefono"] ;

  const [isModalAbierto, setIsModalAbierto] = useState(false);

  const toggleModal = () => {
    setIsModalAbierto(!isModalAbierto);
  }

  return (
    
   <div>
    <Header title="lISTA DE PROVEEDORES" />
    <div>
      <button onClick={() => setIsModalAbierto(true)}>
Agregar Proveedor
      </button>
    </div>
   {listaProveedor.length > 0 ? (
    <StickyTable columns={columnas} data={listaProveedor} />
   ) : (
    <p>NO hay datos</p>
   )}

{isModalAbierto && (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out ${
            isModalAbierto ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`w-full max-w-md p-6 bg-white rounded-lg shadow-lg transform transition-all duration-300 ease-in-out ${
              isModalAbierto ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <h2 className="text-center text-2xl font-semibold mb-4">Registrar Proveedor</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-4">
                <label className="block text-gray-700">Nombre:</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {errores.nombre && <p className="text-red-500 text-sm">{errores.nombre}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">RUC:</label>
                <input
                  type="text"
                  name="ruc"
                  value={formData.ruc}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {errores.ruc && <p className="text-red-500 text-sm">{errores.ruc}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Dirección:</label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Teléfono:</label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {errores.telefono && <p className="text-red-500 text-sm">{errores.telefono}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {errores.email && <p className="text-red-500 text-sm">{errores.email}</p>}
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-200"
              >
                Registrar Proveedor
              </button>
            </form>
            {mensaje && <p className="mt-4 text-center text-blue-600 font-semibold">{mensaje}</p>}
            <button
              onClick={toggleModal}
              className="mt-4 w-full py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition duration-200"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
   </div>

  );
}
