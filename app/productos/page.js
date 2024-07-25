"use client";

import Header from '../components/Header';
import { HiOutlineViewGridAdd } from 'react-icons/hi';
import { useState, useEffect } from 'react';
import addProducto from '../actions/addProducto/addProducto';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [isAbierto, setIsAbierto] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try{
       const response = await fetch("api/productos");
       if (!response.ok) {
        throw new Error("HTTP errro!: ${response.status}")
       }
       const data = await response.json();
       setProductos(data);
      } catch (error) {
       console.error("Error onbtener datos:", error);
      }
    };
    fetchData();
  }, []);

  const abrirModal = () => {
    setIsAbierto(!isAbierto);
  }

   
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
      const nuevoProducto = await addProducto(formData);
      setProductos((prevProductos) => [...prevProductos, nuevoProducto]);
      abrirModal(); // Cierra el modal después de agregar el producto
    } catch (error) {
      console.error("Error al agregar el producto:", error);
    }
  };

    const handleCategoriaChange = (categoria) => {
      setCategoriaSeleccionada(categoria);
    };

    const handleBusquedaChange = (event) => {
      setBusqueda(event.target.value);
    }

    const productosFiltrados = productos.filter(producto => {
      const coincideCategoria = categoriaSeleccionada === "Todos" || producto.categoria === categoriaSeleccionada;
      const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase());
      return coincideCategoria && coincideBusqueda;
    });;


  return (
    <div>
      <Header title="productos" />
      <div className="min-h-screen bg-gray-100 p-5">
        <div className="flex justify-between mb-4">
          <div>
            {/* Aquí podrías añadir más elementos si es necesario */}
            <div>
              <button 
              onClick={() => handleCategoriaChange("Todos")}
              className={`px-4 py-2 mr-2 ${categoriaSeleccionada === "Todos" ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                Todos
              </button>
              <button 
              onClick={() => handleCategoriaChange("PASTEL")}
              className={`px-4 py-2 mr-2 ${categoriaSeleccionada === "PASTEL" ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                Pastel
              </button>
              <button 
              onClick={() => handleCategoriaChange("GASEOSA")}
              className={`px-4 py-2 mr-2 ${categoriaSeleccionada === "GASEOSA" ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                Gaseosa
              </button>
            </div>
          </div>
          <div className="w-96 flex justify-between items-center">
            <div className="w-96">
              <input
                type="text"
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Buscar..."
                value={busqueda}
                onChange={handleBusquedaChange}
              />
            </div>
            <div className="w-1.5"></div>
            <div>
              <div onClick={abrirModal} className="h-10 w-10 bg-indigo-600 rounded-sm flex justify-center items-center cursor-pointer">
                <HiOutlineViewGridAdd color="white" className="h-6 w-6" />
              </div>
              <div className={`fixed top-0 right-0 h-full bg-gray-100 text-black transition-transform transform ${isAbierto ? 'translate-x-0' : 'translate-x-full'} w-64 shadow-lg z-50`}>
                <div className="p-4">
                  <button onClick={abrirModal} className="text-black hover:text-gray-500">
                    &times;
                  </button>
                  <h2 className="text-lg font-bold">Registrar Producto</h2>
                  <form onSubmit={handleSubmit} className='mb-4'>
                    <input 
                     name='nombre'
                     type='text'
                     placeholder='Nombre...'
                     className="shadow appearance-none border rounded py-2 px-3 text-grey-darker mr-2 text-black"
                    />
                     <input 
                     name='precio'
                     type='text'
                     placeholder='Precio...'
                     className="shadow appearance-none border rounded py-2 px-3 text-grey-darker mr-2 text-black"
                    />
                    <input 
                     name='stock'
                     type='text'
                     placeholder='23'
                     className="shadow appearance-none border rounded py-2 px-3 text-grey-darker mr-2 text-black"
                    />
                    <input 
                     name='puntoVenta'
                     type='text'
                     placeholder='45'
                     className="shadow appearance-none border rounded py-2 px-3 text-grey-darker mr-2 text-black"
                    />
                    <select
                    name='categoria'
                    className="shadow appearance-none border rounded py-2 px-3 text-grey-darker mr-2 text-black"
                    > 
                       <option value="">Seleccione una categoría...</option>
                      <option value="PASTEL">PASTEL</option>
                      <option value="GASEOSA">GASEOSA</option>
                    </select>
                    <button type='submit' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      Agreg
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {productosFiltrados.map((producto) => (
            <div key={producto.id} className="bg-white max-w-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300">
              <img className="rounded-xl w-full" src={producto.imagen} />
              <div className="p-5">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-semibold"> {producto.nombre}</h1>
                    <p>${producto.precio}</p>
                    <p>stock: {producto.stock}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
