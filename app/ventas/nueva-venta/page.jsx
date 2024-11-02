"use client";
// shilf + alt + F
import { useState, useEffect } from "react";
import ImageCielo from "@/app/assets/cielo.png";
import imageKr from "@/app/assets/kr.png";
import Delete from "@/app/assets/delete.png";
import TipoDeBaucher from "@/app/components/botonDropdown";
import TextFieldButton from "@/app/components/textFieldButton";
import loader from "@/app/assets/1494.gif";
import axios from 'axios';


export default function NuevaVenta() {
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  //estado para pasar el producto seleccionado
  const [productoSeleccionado, setProductoSeleccionado] = useState([]);
  //modal
  const [modalVisible, setModalVisible] = useState(false);
  const [productoEnModal, setProductoEnModal] = useState(null);
  const [tipoSeleccionado, setTipoSeleccionado] = useState("Tipo de vaucher");
  const categorias = ["Todos", "agua", "gaseosas", "frugos", "papas"];
  const [cargando, setCargando] = useState(false);

  //--------------------------------Función para obtener los productos desde el endpoint----------------------
  const obtenerProductos = async () => {
    try {
      const response = await fetch("/api/productos"); // Cambia la URL según tu endpoint
      if (!response.ok) {
        throw new Error("Error al obtener los productos");
      }
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  useEffect(() => {
    obtenerProductos(); // Llamar a la función al montar el componente
  }, []);

  // funcion patra filtrar productos
  const filtroProductos = productos.filter((producto) => {
    const buscarCoincidencias = producto.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const buscarCategoria =
      categoriaSeleccionada === "Todos"
        ? true // Muestra todos los productos si la categoría es "todos"
        : categoriaSeleccionada
        ? producto.categoria === categoriaSeleccionada
        : true; // Muestra todos los productos si no hay categoría seleccionada
    return buscarCoincidencias && buscarCategoria;
  });

  const imagenesPorCategoria = {
    Todos: imageKr,
    agua: ImageCielo,
    gaseosas: imageKr,
    frugos: ImageCielo,
    papas: ImageCielo,
  };

  //funcion para seleccionar varios productoas
  const manejarSeleccion = (producto) => {
    if (productoSeleccionado.some((p) => p.id === producto.id)) {
      //Si el producto ya esta seleccionado lo eliminamos
      setProductoEnModal(producto);
      setModalVisible(true);
    } else {
      //si no esta seleccionado lo añadimnos antes de votar por defecto canridad 1
      // setProductoSeleccionado((prev) => [...prev, producto, ]);
      //con votar por defcto 1
      setProductoSeleccionado((prev) => [
        ...prev,
        { ...producto, cantidad: 1 },
      ]);
    }
  };

  const eliminarProducto = () => {
    setProductoSeleccionado((prev) =>
      prev.filter((p) => p.id !== productoEnModal.id)
    );
    setModalVisible(false);
    setProductoEnModal(null);
  };

  const eliminarProductoPorId = (id) => {
    setProductoSeleccionado((prevProductos) =>
      prevProductos.filter((producto) => producto.id !== id)
    );
  };

  //funcion para aumnetar la cantidad
  const aumentarCantidad = (id) => {
    setProductoSeleccionado((prevProductos) =>
      prevProductos.map((producto) =>
        producto.id === id
          ? { ...producto, cantidad: (producto.cantidad || 1) + 1 }
          : producto
      )
    );
  };

  //funcion para disminuir
  const disminuirCantidad = (id) => {
    setProductoSeleccionado((prevProductos) =>
      prevProductos.map((producto) =>
        producto.id === id && (producto.cantidad || 1) > 1
          ? { ...producto, cantidad: producto.cantidad - 1 }
          : producto
      )
    );
  };

  //funcionpara calcular el total
  const calcularTotal = () => {
    return productoSeleccionado.reduce((total, producto) => {
      return total + producto.precioVenta * producto.cantidad;
    }, 0);
  };

  //funcion para calcular la utilidad
  const calcularUtilidad = () => {
    return productoSeleccionado.reduce((total, producto) => {
      const utilidadProducto =
        (producto.precioVenta - producto.precioCompra) * producto.cantidad;
      return total + utilidadProducto;
    }, 0);
  };

  //------------------------------ FUNCIONES PARA REALIZAR VENTAS---------------------------------
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [clientesFiltrados, setClientesFiltrados] = useState([]);

  // Función para buscar clientes
const buscarClientes = async () => {
  if (!busquedaCliente) {
    setClientesFiltrados([]); // Limpiar si no hay búsqueda
    return;
  }

  try {
    const response = await fetch(`/api/clientes?nombre=${busquedaCliente}`);
    const data = await response.json();
    // Filtrar los clientes según el nombre
    const clientesFiltrados = data.filter((cliente) =>
      cliente.nombre.toLowerCase().includes(busquedaCliente.toLowerCase())
    );
    setClientesFiltrados(clientesFiltrados);
  } catch (error) {
    console.error("Error al buscar clientes:", error);
  }
};
  
  
  // Ejecutar la búsqueda cada vez que cambie el input de búsqueda
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      buscarClientes();
    }, 300); // Añade un pequeño retraso para evitar demasiadas llamadas a la API

    return () => clearTimeout(delayDebounceFn);
  }, [busquedaCliente]);

  // Función para manejar la selección de cliente
  const manejarSeleccionCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setBusquedaCliente(cliente.nombre);
    setClientesFiltrados([]);
  };

  const limpiarSeleccion = () => {
    setClienteSeleccionado(null);

    setBusquedaCliente("");
  };

  const realizarVenta = async () => {
    if (tipoSeleccionado === "Tipo de vaucher") {
      alert(
        "Por favor, selecciona un tipo de vaucher antes de realizar la venta."
      );

      return;
    }



    console.log("Cliente seleccionado:", clienteSeleccionado);
    if (!clienteSeleccionado) {
      alert("Por favor, selecciona un cliente antes de realizar la venta.");
      return;
    }
    
    console.log("Productos seleccionados:", productoSeleccionado);
    console.log("Tipo de venta seleccionado:", tipoSeleccionado);

    const total = calcularTotal();

    setCargando(true);

    try {
      const response = await fetch("/api/ventas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cliente: { id: clienteSeleccionado.id }, // Enviar 'cliente' como objeto
          productos: productoSeleccionado.map((producto) => ({
            id: producto.id, // Usar 'id' en lugar de 'productoId'
            cantidad: producto.cantidad,
            precioVenta: producto.precioVenta,
            // No enviar 'precioCompra' ya que el servidor lo obtiene
          })),
          total: total,
          tipoVenta: tipoSeleccionado,
          bonificaciones: bonificaciones.map((bonificacion) => ({
            productoId: bonificacion.productoId,
            cantidad: bonificacion.cantidad,
          })),
        
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al realizar la venta");
      }

      const data = await response.json();
      console.log("Venta realizada con éxito:", data);
      // Restablecer los estados si es necesario
      setProductoSeleccionado([]);
      setClienteSeleccionado(null);
      setBusquedaCliente("");
      setClientesFiltrados([]);
      setBonificaciones([]);
  
    } catch (error) {
      console.error("Error al realizar la venta:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  const [productosBonificados, setProductosBonificados] = useState([]);
const [mostrarBonificaciones, setMostrarBonificaciones] = useState(false);
const [bonificaciones, setBonificaciones] = useState([]);

useEffect(() => {
  const obtenerBonificaciones = async () => {
    try {
      const response = await axios.get("/api/bonificaciones");
      setProductosBonificados(response.data);
    } catch (error) {
      console.error("Error al obtener las bonificaciones:", error);
    }
  };

  obtenerBonificaciones();
}, []);

const manejarCantidadBonificacion = (productoId, cantidad) => {
  setBonificaciones((prev) => {
    const index = prev.findIndex((b) => b.productoId === productoId);
    if (index !== -1) {
      const nuevaBonificacion = [...prev];
      nuevaBonificacion[index].cantidad = cantidad;
      return nuevaBonificacion;
    } else {
      return [...prev, { productoId, cantidad }];
    }
  });
};

  return (
    
    <div className="w-full h-screen bg-grayCustom flex justify-between items-center p-4">
      <div className="w-3/5 h-full">
        {/* seccion cataegorias y busqueda */}
        <div className="w-full h-28 flex rounded-lg gap-4">
          {categorias.map((categoria) => (
            <div
              key={categoria}
              className={`bg-white cursor-pointer montserrat-uno flex flex-col items-center h-full p-2 rounded-lg ${
                categoriaSeleccionada === categoria
                  ? "border border-black text-black"
                  : "text-black"
              }`}
              onClick={() => {
                // Cambiar la categoría seleccionada
                setCategoriaSeleccionada((prev) =>
                  prev === categoria ? "Todos" : categoria
                );
              }}
            >
              <div className="">
                <img
                  src={imagenesPorCategoria[categoria].src}
                  className="w-16 h-16"
                  alt="Cielo"
                />
              </div>
              <span className="mt-2">{categoria}</span>
            </div>
          ))}
        </div>
        <div className="w-full h-12 flex items-center mt-6">
          <input
            type="text"
            placeholder="Buscar prpoducto"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        {/* scroll display prodcutos */}
        <div className="flex-grow overflow-y-auto h-[690px] mt-5">
          <div className="overflow-x-auto">
            {/* display en grids */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {filtroProductos.map((producto) => (
                <div key={producto.id}>
                  <div
                    onClick={() => manejarSeleccion(producto)}
                    className="w-36 h-44 rounded-lg bg-white flex flex-col items-center"
                  >
                    <div className="mt-2 h-3/5 w-5/6">
                      <img
                        src={producto.imagen}
                        className="w-full h-full rounded-lg"
                        alt="Eliminar producto"
                      />
                    </div>
                    <div className="w-5/6 h-full relative mt-2">
                      <h6 className="kanit-thin text-sm/[13px]">
                        {producto.nombre.length > 15 ? (
                          <span className="relative group">
                            {producto.nombre.slice(0, 15) + "..."}
                            <span className="absolute hidden group-hover:block bg-gray-700 text-white text-xs rounded p-2 z-10 whitespace-nowrap">
                              {producto.nombre}
                            </span>
                          </span>
                        ) : (
                          producto.nombre
                        )}
                      </h6>
                      <p className="inset-y-0 kanit-semibold text-sm/[25px] ">
                        ${producto.precioVenta}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* separa  las dos divs */}
      <div className="w-3"></div>
      <div className="w-2/5 h-full rounded-lg mx-auto bg-white">
        <div className="p-4 w-full h-22 border-b">
          <p className="kanit-semibold text-lg ">Lista de Productos</p>
        </div>
        <div className="p-4 relative">
          <div className="relative">
            <input
              type="text"
              className="w-full p-4 pl-10 text-sm text-gray-700 rounded-lg shadow-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Buscar cliente"
              value={busquedaCliente}
              onChange={(e) => {
                setBusquedaCliente(e.target.value);

                buscarClientes();
              }}
              onFocus={() => buscarClientes()}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute top-4 left-4 h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
            {clienteSeleccionado && (
              <button
                onClick={limpiarSeleccion}
                className="absolute right-2 top-2 text-gray-500"
              >
                X
              </button>
            )}

{busquedaCliente && clientesFiltrados.length > 0 && (
  <div className="absolute z-20 w-full max-w-lg mt-2 bg-white border border-gray-200 rounded-xl shadow-lg">
    <ul className="max-h-60 overflow-y-auto p-2 transition-all duration-500 ease-in-out">
      {clientesFiltrados.map((cliente) => (
        <li
          key={cliente.id}
          onClick={() => manejarSeleccionCliente(cliente)}
          className="flex items-center gap-4 cursor-pointer p-3 rounded-lg hover:bg-blue-100 hover:shadow-md transition-colors duration-200 ease-in-out"
        >
          <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center">
            {cliente.nombre.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-gray-700">{cliente.nombre}</span>
        </li>
      ))}
    </ul>
  </div>
)}

          </div>
          {busquedaCliente && clientesFiltrados.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg">
              {clientesFiltrados.map((cliente) => (
                <li
                  key={cliente.id}
                  onClick={() => manejarSeleccionCliente(cliente)} // Cambiar a esta función
                  className="cursor-pointer hover:bg-gray-200 p-2"
                >
                  {cliente.nombre}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Contenedor con scroll y alto fijo de 500px */}
        <div className="h-3/5 bg-white overflow-y-auto p-3">
          {productoSeleccionado.map((producto) => (
            <div
              key={producto.id}
              className="w-11/12 h-28 flex rounded-lg bg-grayCustom mb-2"
            >
              <div className="w-2/5 h-full rounded-lg ">
                <img
                  className="w-full h-full rounded-lg"
                  src={producto.imagen}
                  alt="Eliminar producto"
                />
              </div>
              <div className="p-2">
                <p className="font-fira-sans text-sm/[14px]">
                  {producto.nombre.length > 28
                    ? producto.nombre.slice(0, 28) + ""
                    : producto.nombre}
                </p>
                <div className="w-full mt-1 h-8 flex flex-col justify-start">
                  <p className="kanit-semibold text-black text-lg">
                    ${producto.precioVenta}
                  </p>

                  <div className="w-full flex justify-between items-center">
                    <div className=" flex items-center gap-2">
                      <button
                        onClick={() => disminuirCantidad(producto.id)}
                        className="p-2 bg-grayCustom rounded-lg"
                      >
                        -
                      </button>
                      <p>{producto.cantidad}</p>
                      <button
                        onClick={() => aumentarCantidad(producto.id)}
                        className="p-2 bg-grayCustom rounded-lg"
                      >
                        +
                      </button>
                    </div>
                    <img
                      src={Delete.src}
                      onClick={() => eliminarProductoPorId(producto.id)}
                      className="w-9 h-9"
                      alt="Eliminar producto"
                    />
                  </div>
                </div>
                {/* Sección de cantidad */}
              </div>
            </div>
          ))}
        </div>

        {/* Otro div debajo del contenedor con scroll */}
        <div className="flex items-center justify-center">
          <div className="p-3 h-1/6 w-11/12 bg-gray-100  text-white rounded-lg">
            <div className="mt-3 flex justify-between items-center w-full">
              <p className="kanit-semibold text-[] text-black">Informacion:</p>
              <div className="flex flex-col">
                <select
                  value={tipoSeleccionado}
                  onChange={(e) => setTipoSeleccionado(e.target.value)}
                  className="w-full p-2 border rounded-lg text-black"
                >
                  <option value="Tipo de vaucher">Tipo de vaucher</option>

                  <option value="Boleta">Boleta</option>

                  <option value="Factura">Factura</option>
                </select>
              </div>
            </div>
            <div className="mt-2 border-b-2"></div>
            <div className="relative">
  <button onClick={() => setMostrarBonificaciones(!mostrarBonificaciones)} className="bg-gray-300 text-black p-2 rounded ml-2">
    Bonificaciones
  </button>
  <div className={`absolute z-10 w-64 bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-300 ${
    mostrarBonificaciones ? "max-h-screen opacity-100 p-4" : "max-h-0 opacity-0 p-0"
  }`}>
    <ul className="list-disc pl-5">
      {productosBonificados.length > 0 ? (
        productosBonificados.map((producto) => (
          <li key={producto.productoId} className="text-black mt-2 flex items-center justify-between">
            {producto.producto.nombre}
            <input
              type="number"
              min="0"
              value={bonificaciones.find((b) => b.productoId === producto.productoId)?.cantidad || 0}
              onChange={(e) => manejarCantidadBonificacion(producto.productoId, Number(e.target.value))}
              className="w-12 p-1 border rounded text-center ml-4"
            />
          </li>
        ))
      ) : (
        <li>No hay productos bonificados</li>
      )}
    </ul>
  </div>
</div>



            <div className="flex mt-1 justify-between items-center w-full">
              <p className="font-roboto-condensed font-bold text-sm text-black">
                TOTAL:
              </p>
              <p className="font-roboto-condensed font-bold  text-black">
                ${calcularTotal().toFixed(2)}
              </p>
            </div>
            <div className="flex justify-between items-center w-full">
              <p className="font-roboto-condensed font-bold -sm text-black">
                UTILIDAD:
              </p>
              <p className="font-roboto-condensed font-bold  text-black">
                ${calcularUtilidad().toFixed(2)}
              </p>
            </div>
            <div className="w-full h-14 flex justify-between ">
              <div className="w-full h-14 flex justify-between ">
                <button
                  onClick={realizarVenta}
                  className="bg-black w-full p-2  text-white rounded-lg"
                  disabled={cargando}
                >
                  {cargando ? "Realizando venta..." : "Realizar Venta"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <h4 className="text-lg font-semibold">
              El producto "{productoEnModal.nombre}" ya está seleccionado.
            </h4>
            <p>¿Deseas eliminarlo de la selección?</p>
            <div className="mt-4 flex justify-between">
              <button
                className="p-2 bg-blue-500 text-white rounded"
                onClick={eliminarProducto}
              >
                Sí, eliminar
              </button>
              <button
                className="p-2 bg-gray-300 rounded"
                onClick={() => setModalVisible(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
